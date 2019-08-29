import * as functions from 'firebase-functions';

import { getCollectionIndexEntryReference, PropertyWeightDictonary, isPropertyWeightDictonary } from "../collectionIndexEntry";
import Cache from "../../../dataStructures/cache";
import { Token, SemanticParser, isValidToken } from "../../../utilities/semanticParser";
import { isObject, isNumber, isArray } from "util";
import getDataFromReference from '../../../utilities/getDataFromReference';

interface HitBinEntry extends Token {
    documentId: string,
    property: string,
}

export function isHitBinEntry(candidate: any): candidate is HitBinEntry {
    return true;
}

export function areHitBinEntrys(candidate: any): candidate is HitBinEntry[] {
    if (!isArray(candidate)) {
        return false;
    }
    for (const element of candidate) {
        if (!isValidToken(element)) {
            return false;
        }
    }
    return true;
}

export function getHitBinReference(): FirebaseFirestore.CollectionReference {
    return getCollectionIndexEntryReference().collection('hitBin');
}

export async function getHitsByDocumentAndLemma(documentId: string, lemma: string) {
    return (await getDataFromReference(
        getHitBinReference().where('documentId', '==', documentId).where('lemma', '==', lemma),
        areHitBinEntrys,
    ) as HitBinEntry[]);
}

export async function countHits(propertyWeightDictonary: PropertyWeightDictonary) {
    const countHitPromises: Array<Promise<any>> = [];
    countHitsInObjectRecursiv(
        Cache.getTriggerDocumentSnapshot().data(),
        propertyWeightDictonary,
        countHitPromises,
    );
    await Promise.all(countHitPromises);
}

export async function removeAllHitsAssociatedWithTheDocumentToBeDeleted() {
    const relevantDocuments = await getHitBinReference().where('documentId', '==', Cache.getTriggerDocumentSnapshot().id).get();
    relevantDocuments.forEach(async snap => snap.ref.delete());
}

function countHitsInObjectRecursiv(obj: any, propertyWeightDictonary: PropertyWeightDictonary, countHitPromises: Array<Promise<any>>, deepKey: string = "") {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const localDeepKey = deepKey.length === 0 ? key : deepKey + "." + key;
            if (isObject(obj[key])) {
                if (!propertyWeightDictonary.hasOwnProperty(key)) {
                    propertyWeightDictonary[key] = {};
                }
                const subDictonary = propertyWeightDictonary[key];
                if (isPropertyWeightDictonary(subDictonary)) {
                    countHitsInObjectRecursiv(obj[key], subDictonary, countHitPromises, localDeepKey);
                } else {
                    throw new functions.https.HttpsError('internal', '...');
                }
            } else {
                const value = String(obj[key]);
                if (!propertyWeightDictonary.hasOwnProperty(key)) {
                    propertyWeightDictonary[key] = 1;
                }
                const propertyWeight = propertyWeightDictonary[key];
                if (isNumber(propertyWeight)) {
                    const countHitPromise = countHitsInText(value, propertyWeight, localDeepKey);
                    countHitPromises.push(countHitPromise);
                } else {
                    throw new functions.https.HttpsError('internal', '...');
                }
            }
        }
    }
}

async function countHitsInText(text: string, weight: number, deepKey: string) {
    const tokens = await SemanticParser.parse(text);
    for (const token of tokens) {
        if (token.sematicProperties.punc) {
            continue;
        }

        Cache.getSeenLemmaOverview()[token.lemma] = true;

        (token as any).property = deepKey;
        (token as any).documentId = Cache.getTriggerDocumentSnapshot().id;
        if (isHitBinEntry(token)) {
            await getHitBinReference().add(token);
        } else {
            throw new functions.https.HttpsError('internal', '...');
        }

        Cache.setDocumentLength(Cache.getDocumentLength() + weight);
    }
}