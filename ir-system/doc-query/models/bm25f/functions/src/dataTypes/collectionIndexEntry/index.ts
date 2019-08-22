import * as functions from 'firebase-functions';
import { db } from "../..";

import Cache from "../../dataStructures/cache";
import { isDocumentIndexEntry, getDocumentIndexEntryReference } from "../documentIndexEntry";

export interface PropertyWeightDictonary {
    [key: string]: PropertyWeightDictonary | number,
}

export function isPropertyWeightDictonary(candidate: any): candidate is PropertyWeightDictonary {
    return true
}

export interface CollectionIndexEntry {
    name: string,
    documentCount: number,
    averageLength: number,
    propertyWeightDictonary: PropertyWeightDictonary,
}

export function isCollectionIndexEntry(candidate: any): candidate is CollectionIndexEntry {
    return true;
}

export function getCollectionIndexEntryReference(): FirebaseFirestore.DocumentReference {
    return db.collection('collectionIndex').doc(Cache.getContext().params.collId);
}

export async function removeFromCollectionIndexEntry() {
    db.runTransaction(async transaction => {
        return Promise.all([transaction.get(getCollectionIndexEntryReference()), transaction.get(getDocumentIndexEntryReference())]).then(docs => {
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
    });
}