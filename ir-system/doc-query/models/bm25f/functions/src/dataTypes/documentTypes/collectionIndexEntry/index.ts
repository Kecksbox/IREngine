import * as functions from 'firebase-functions';
import { db } from "../../..";

import Cache from "../../../dataStructures/cache";
import { isDocumentIndexEntry, DocumentIndexEntry, getCachedDocumentIndexEntryReference } from "../documentIndexEntry";
import { isString, isNumber, isObject } from 'util';
import getDataFromReference from '../../../utilities/getDataFromReference';

export interface PropertyWeightDictonary {
    [key: string]: PropertyWeightDictonary | number,
}

export function isPropertyWeightDictonary(candidate: any): candidate is PropertyWeightDictonary {
    if (!isObject(candidate)) {
        return false;
    }
    for (const key in candidate) {
        if (candidate.hasOwnProperty(key)) {
            if (!(isPropertyWeightDictonary(candidate[key]) || isNumber(candidate[key]))) {
                return false;
            }
        }
    }
    return true;
}

export interface CollectionIndexEntry {
    name: string,
    totalDocuments: number,
    averageLength: number,
    propertyWeightDictonary: PropertyWeightDictonary,
}

export function isCollectionIndexEntry(candidate: any): candidate is CollectionIndexEntry {
    if (!(candidate.hasOwnProperty('name') && isString(candidate.name))) {
        return false;
    }
    if (!(candidate.hasOwnProperty('totalDocuments') && isNumber(candidate.totalDocuments))) {
        return false;
    }
    if (!(candidate.hasOwnProperty('averageLength') && isNumber(candidate.averageLength))) {
        return false;
    }
    if (!(candidate.hasOwnProperty('propertyWeightDictonary') && isPropertyWeightDictonary(candidate.propertyWeightDictonary))) {
        return false;
    }
    return true;
}

export function getCollectionIndexEntryReference(): FirebaseFirestore.DocumentReference {
    return db.collection('collectionIndex').doc(Cache.getCollectionId());
}

export async function getCollectionIndexEntryData() {
    return await getDataFromReference(getCollectionIndexEntryReference(), isCollectionIndexEntry) as CollectionIndexEntry;
}

export async function removeFromCollectionIndexEntry() {
    await CollectionIndexEntryTransaction(
        removeFromCollectionIndexEntryOperation,
    );
}

export function addDocumentToCollectionIndexOperation(transaction: FirebaseFirestore.Transaction, collectionIndexEntryData: CollectionIndexEntry) {
    transaction.update(
        getCollectionIndexEntryReference(),
        {
            totalDocuments: collectionIndexEntryData.totalDocuments + 1,
            averageLength: ((collectionIndexEntryData.averageLength * collectionIndexEntryData.totalDocuments) + Cache.getDocumentLength()) / (collectionIndexEntryData.totalDocuments + 1),
            propertyWeightDictonary: collectionIndexEntryData.propertyWeightDictonary,
        }
    );
}

export async function CollectionIndexEntryTransaction(operation: (transaction: FirebaseFirestore.Transaction, collectionIndexEntryData: CollectionIndexEntry, documentIndexEntryData: DocumentIndexEntry) => Promise<void>) {
    await db.runTransaction(transaction => {
        return Promise.all([transaction.get(getCollectionIndexEntryReference()), transaction.get(getCachedDocumentIndexEntryReference())]).then(async docs => {
            const collectionIndexEntry = docs[0];
            const documentIndexEntry = docs[1];

            const collectionIndexEntryData = collectionIndexEntry.data();
            if (isCollectionIndexEntry(collectionIndexEntryData)) {
                const documentIndexEntryData = documentIndexEntry.data();
                if (isDocumentIndexEntry(documentIndexEntryData)) {
                    await operation(transaction, collectionIndexEntryData, documentIndexEntryData);
                } else {
                    throw new functions.https.HttpsError('internal', '...');
                }
            } else {
                throw new functions.https.HttpsError('internal', '...');
            }
        });
    });
}

async function removeFromCollectionIndexEntryOperation(transaction: FirebaseFirestore.Transaction, collectionIndexEntryData: CollectionIndexEntry, documentIndexEntryData: DocumentIndexEntry) {
    transaction.update(
        getCollectionIndexEntryReference(),
        {
            totalDocuments: collectionIndexEntryData.totalDocuments - 1,
            averageLength: ((collectionIndexEntryData.averageLength * collectionIndexEntryData.totalDocuments) - documentIndexEntryData.length) / (collectionIndexEntryData.totalDocuments - 1)
        }
    );
}