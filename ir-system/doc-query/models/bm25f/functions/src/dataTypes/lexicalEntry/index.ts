import * as functions from 'firebase-functions';
import { db } from "../..";

import { getCollectionIndexEntryReference, isCollectionIndexEntry, CollectionIndexEntry } from "../collectionIndexEntry";
import Cache from "../../dataStructures/cache";

export interface SeenLemmaOverview {
    [key: string]: boolean
}

export interface ParticipatingDocOverview {
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
    const relevantDocuments = await getLexiconReference().where(`docsContainingLemma.${Cache.getTriggerDocumentSnapshot().id}`, '==', true).get();
    relevantDocuments.forEach(snap => LexiconTransaction(
        snap.ref,
        removeDocumentToBeDeletedFromAssociatedLexiconEntryIfExists,
        removeDocumentToBeDeletedFromAssociatedLexiconEntryIfNonExistent,
    ));
}

export async function addDocumentToLexiconEntry() {
    const seenLemmaOverview = Cache.getSeenLemmaOverview();
    for (const lemma in seenLemmaOverview) {
        if (seenLemmaOverview.hasOwnProperty(lemma) && seenLemmaOverview[lemma]) {
            LexiconTransaction(
                getLexiconReference().doc(lemma),
                addDocumentToLexiconEntryIfExists,
                addDocumentToLexiconEntryIfNonExistent,
            );
        }
    }
}

async function removeDocumentToBeDeletedFromAssociatedLexiconEntryIfExists(transaction: FirebaseFirestore.Transaction, lexicalEntryRef: FirebaseFirestore.DocumentReference, lexicalEntryData: LexicalEntry, collectionIndexEntryData: CollectionIndexEntry) {
    delete lexicalEntryData.participatingDocOverview[Cache.getTriggerDocumentSnapshot().id]
    transaction.update(
        lexicalEntryRef,
        {
            idfScore: computeIdfScore(lexicalEntryData.participatingDocCount - 1, collectionIndexEntryData.documentCount),
            participatingDocCount: lexicalEntryData.participatingDocCount - 1,
            participatingDocOverview: lexicalEntryData.participatingDocOverview,
        }
    );
}

function removeDocumentToBeDeletedFromAssociatedLexiconEntryIfNonExistent(transaction: FirebaseFirestore.Transaction, lexicalEntryRef: FirebaseFirestore.DocumentReference, collectionIndexEntryData: CollectionIndexEntry) {
    throw new functions.https.HttpsError('internal', '...');
}

async function addDocumentToLexiconEntryIfExists(transaction: FirebaseFirestore.Transaction, lexicalEntryRef: FirebaseFirestore.DocumentReference, lexicalEntryData: LexicalEntry, collectionIndexEntryData: CollectionIndexEntry) {
    lexicalEntryData.participatingDocOverview[Cache.getContext().params.docID] = true;
    transaction.update(
        lexicalEntryRef,
        {
            idfScore: computeIdfScore(lexicalEntryData.participatingDocCount + 1, collectionIndexEntryData.documentCount),
            participatingDocCount: lexicalEntryData.participatingDocCount + 1,
            participatingDocOverview: lexicalEntryData.participatingDocOverview,
        }
    );
}

async function addDocumentToLexiconEntryIfNonExistent(transaction: FirebaseFirestore.Transaction, lexicalEntryRef: FirebaseFirestore.DocumentReference, collectionIndexEntryData: CollectionIndexEntry) {
    const participatingDocOverview: ParticipatingDocOverview = {};
    participatingDocOverview[Cache.getContext().params.docID] = true;
    transaction.set(
        lexicalEntryRef,
        {
            idfScore: computeIdfScore(0 + 1, collectionIndexEntryData.documentCount),
            participatingDocCount: 0 + 1,
            participatingDocOverview,
        }
    );
}

function computeIdfScore(documentsContainingLemma: number, totalDocuments: number) {
    return Math.log(1 + ((totalDocuments - documentsContainingLemma + 0.5) / (documentsContainingLemma + 0.5)));
}

async function LexiconTransaction(lexicalEntryRef: FirebaseFirestore.DocumentReference, ifExists: (transaction: FirebaseFirestore.Transaction, lexicalEntryRef: FirebaseFirestore.DocumentReference, lexicalEntryData: LexicalEntry, collectionIndexEntryData: CollectionIndexEntry) => void, IfNonExistent: (transaction: FirebaseFirestore.Transaction, lexicalEntryRef: FirebaseFirestore.DocumentReference, collectionIndexEntryData: CollectionIndexEntry) => void) {
    return db.runTransaction(async transaction => {
        return Promise.all([transaction.get(lexicalEntryRef), transaction.get(getCollectionIndexEntryReference())]).then(docs => {
            const lexicalEntry = docs[0];
            const collectionIndexEntry = docs[1];

            const collectionIndexEntryData = collectionIndexEntry.data();
            if (isCollectionIndexEntry(collectionIndexEntryData)) {
                if (!lexicalEntry.exists) {
                    IfNonExistent(transaction, lexicalEntryRef, collectionIndexEntryData);
                } else {
                    const lexicalEntryData = lexicalEntry.data();
                    if (isLexicalEntry(lexicalEntryData)) {
                        ifExists(transaction, lexicalEntryRef, lexicalEntryData, collectionIndexEntryData);
                    } else {
                        throw new functions.https.HttpsError('internal', '...');
                    }
                }
            } else {
                throw new functions.https.HttpsError('internal', '...');
            }
        });
    });
}