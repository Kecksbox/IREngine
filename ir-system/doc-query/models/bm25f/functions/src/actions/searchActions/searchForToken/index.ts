import * as functions from 'firebase-functions';
import * as rpn from 'request-promise-native';

import { Token } from '../../../utilities/semanticParser';
import { PropertyWeightDictonary } from '../../../dataTypes/documentTypes/collectionIndexEntry';
import { getLexiconEntryDataByLemma } from '../../../dataTypes/documentTypes/lexicalEntry';
import { getDocumentIndexEntryDataByDocumentId } from '../../../dataTypes/documentTypes/documentIndexEntry';
import { ComputeFijScoreData } from '../computeFijScoreForDocumentAction';
import { DocumentScoreDictonary } from '../../../dataTypes/documentScoreDictonary';
import Cache from '../../../dataStructures/cache';

export interface SearchForTokenData {
    collectionId: string,
    index: number,
    searchTokens: Token[],
    propertyWeightDictonary: PropertyWeightDictonary,
    averageLength: number,
}

export async function searchForTokenAction(request: functions.Request, response: functions.Response) {
    const data = request.body;
    console.log("reached search for token:", data);
    if (isSearchForTokenData(data)) {

        Cache.refreshByCollectionId(data.collectionId);

        const documentScoreDictonary: DocumentScoreDictonary = {};

        const computeTokenScorePromises: Promise<any>[] = [];
        const lexiconEntryData = await getLexiconEntryDataByLemma(data.searchTokens[data.index].lemma);
        for (const key in lexiconEntryData.participatingDocOverview) {
            if (lexiconEntryData.participatingDocOverview.hasOwnProperty(key)) {
                computeTokenScorePromises.push(computeTokenScoreForDocument({
                    collectionId: data.collectionId,
                    index: data.index,
                    searchTokens: data.searchTokens,
                    propertyWeightDictonary: data.propertyWeightDictonary,
                    averageLength: data.averageLength,
                    documentId: key,
                },
                    documentScoreDictonary,
                ));
            }
        }
        await Promise.all(computeTokenScorePromises);
        return documentScoreDictonary;
    } else {
        throw new functions.https.HttpsError('internal', '...');
    }
}

export function isSearchForTokenData(candidate: any): candidate is SearchForTokenData {
    return true;
}

async function computeTokenScoreForDocument(data: ComputeFijScoreData, documentScoreDictonary: DocumentScoreDictonary) {
    const k1 = 1.2;
    const b = 0.5;

    const documentIndexEntryData = await getDocumentIndexEntryDataByDocumentId(data.documentId);
    const fijScore = await callComputeFijScoreCloudFunction(data);
    documentScoreDictonary[data.documentId] = (
        (fijScore * (k1 + 1))
        /
        (fijScore + k1 * ((1 - b) + b * (documentIndexEntryData.length / data.averageLength)))
    );
}

async function callComputeFijScoreCloudFunction(body: ComputeFijScoreData) {
    try {
        return await rpn({
            method: 'POST',
            uri: 'https://us-central1-irengine-fd40f.cloudfunctions.net/computeFijScoreForDocument',
            body,
            json: true,
        }) as number;
    } catch (err) {
        throw new functions.https.HttpsError('internal', '...');
    }
}