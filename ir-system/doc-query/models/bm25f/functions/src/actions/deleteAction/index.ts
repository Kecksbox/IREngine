import * as functions from 'firebase-functions';

import Cache from "../../dataStructures/cache";
import { db } from "../..";
import { isCollectionIndexEntry } from "../../dataTypes/collectionIndexEntry";
import { isDocumentIndexEntry } from '../../dataTypes/documentIndexEntry';

/*

(Singel documents like the collIndexEntry can be lazy loaded)

1. Update the DocIndex by deleting the corresponding document.
2. Update the CollIndexEntry by reducing the number of documents by 1. 
   (Properties of the PropObj should be garbageCleaned in a separate process.)

3. Load leikon entries into the cache.
   (In all these documents the idf score is adjusted, the docCount is reduced by 1 and the document to be deleted is removed from the contained documents. )
4. Load hits for the document to be deleted into the cache.
   (All these documents will be marked for deletion.)

*/

export default async () => {
    deleteDocumentIndexEntry();
    removeFromCollectionIndexEntry();

    removeDocumentToBeDeletedFromAllAssociatedLexiconEntries();
    removeAllHitsAssociatedWithTheDocumentToBeDeleted();
}

async function deleteDocumentIndexEntry() {
    await Cache.getDocumentIndexEntryRef().delete();
}

async function removeFromCollectionIndexEntry() {
    db.runTransaction(async transaction => {
        return Promise.all([transaction.get(Cache.getCollectionIndexEntryRef()), transaction.get(Cache.getDocumentIndexEntryRef())]).then(docs => {
            const collectionIndexEntry = docs[0];
            const documentIndexEntry = docs[1];

            const collectionIndexEntryData = collectionIndexEntry.data();
            if (isCollectionIndexEntry(collectionIndexEntryData)) {
                const documentIndexEntryData = documentIndexEntry.data();
                if (isDocumentIndexEntry(documentIndexEntryData)) {
                    transaction.update(
                        collectionIndexEntry.ref, 
                        { 
                            docCount: collectionIndexEntryData.documentCount - 1,
                            avgLength: ((collectionIndexEntryData.averageLength * collectionIndexEntryData.documentCount) - documentIndexEntryData.length) / (collectionIndexEntryData.documentCount - 1)
                        }
                    );
                } else {
                    throw new functions.https.HttpsError('internal', '...');
                }
            } else {
                throw new functions.https.HttpsError('internal', '...');
            }   
        });
    })
}

async function removeDocumentToBeDeletedFromAllAssociatedLexiconEntries() {
    const triggerDocumentID = Cache.getTriggerDocumentSnapshot().id;
    const relevantDocuments = await (await getLexiconRef()).where(`docsContainingLemma.${triggerDocumentID}`, '==', true).get();
    relevantDocuments.forEach(snap => {
        const lexicalEntry = new Changelog(
            new LexicalEntry(
                snap
            )
        );
        delete lexicalEntry.getDocument().getDocsContainingLemma()[triggerDocumentID];
        lexicalEntry.getDocument().countDown();
        lexicalEntry.getDocument().updateIdf();
    });
}

async function removeAllHitsAssociatedWithTheDocumentToBeDeleted() {
    const relevantDocuments = await (await getHitBinRef()).where('documentId', '==', Cache.getTriggerDocumentSnapshot().id).get();
    relevantDocuments.forEach(async snap => {
        (await Cache.getHitBin()).addChangelog(new Changelog(
            new HitBinEntry(
                snap
            ),
            OperationType.delete
        ));
    })
}