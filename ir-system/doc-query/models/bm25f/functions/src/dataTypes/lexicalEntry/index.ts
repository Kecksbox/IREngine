import * as functions from 'firebase-functions';
import { db } from "../..";

import { getCollectionIndexEntryReference } from "../collectionIndexEntry";
import Cache from "../../dataStructures/cache";

export interface SeenLemmaOverview {
    [key: string]: boolean
}

interface ParticipatingDocOverview {
    [key: string]: boolean,
}

interface LexicalEntry {
    idfScore: number,
    participatingDocCount: number,
    participatingDocOverview: ParticipatingDocOverview,
}

export function isLexicalEntry(candidate: any): candidate is LexicalEntry {
    return true;
}

export function getLexiconReference(): FirebaseFirestore.CollectionReference {
    return getCollectionIndexEntryReference().collection('lexicon');
}

export async function removeDocumentToBeDeletedFromAllAssociatedLexiconEntries() {
    const triggerDocumentID = Cache.getTriggerDocumentSnapshot().id;
    const relevantDocuments = await getLexiconReference().where(`docsContainingLemma.${triggerDocumentID}`, '==', true).get();
    relevantDocuments.forEach(snap => db.runTransaction(async transaction => {
        return transaction.get(snap.ref).then(lexicalEntry => {
            const lexicalEntryData = lexicalEntry.data();
            if (isLexicalEntry(lexicalEntryData)) {
                delete lexicalEntryData.participatingDocOverview[triggerDocumentID]
                transaction.update(
                    lexicalEntry.ref,
                    {   
                        // MUST BE REPLACED IN THE FUTURE
                        idfScore: 0,
                        participatingDocCount: lexicalEntryData.participatingDocCount - 1,
                        participatingDocOverview: lexicalEntryData.participatingDocOverview,
                    }
                );
            } else {
                throw new functions.https.HttpsError('internal', '...');
            }
        });
    }));
}