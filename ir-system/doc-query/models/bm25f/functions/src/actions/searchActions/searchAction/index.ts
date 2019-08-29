import * as functions from 'firebase-functions';
import * as rpn from 'request-promise-native';
import { SemanticParser } from "../../../utilities/semanticParser";
import { isString } from 'util';
import { getCollectionIndexEntryData } from '../../../dataTypes/documentTypes/collectionIndexEntry';
import { SearchForTokenData } from '../searchForToken';
import { DocumentScoreDictonary, mergeDocumentScoreDictonarys, isDocumentScoreDictonary, createSortedListOfDocumentIdsFromDocumentScoreDictonary } from '../../../dataTypes/documentScoreDictonary';
import Cache from '../../../dataStructures/cache';

/*

Incomming Request have the Form:
.../search?c=xxxxxxxxxxx&q=hello+world

*/

export async function searchAction(request: functions.Request, response: functions.Response) {
    if (isValidRequest(request) === false) {
        throw new functions.https.HttpsError('internal', '...');
    }

    Cache.refreshByCollectionId(request.query.c);

    const documentScoreDictonary: DocumentScoreDictonary = {};

    const searchTokens = await preProcessSearchString(request.query.q);
    const collectionIndexEntryData = await getCollectionIndexEntryData();

    const searchForTokenPromises: Array<Promise<void>> = [];
    for (let i = 0, len = searchTokens.length; i < len; ++i) {
        searchForTokenPromises.push(
            searchForToken({
                collectionId: Cache.getCollectionId(),
                index: i,
                searchTokens,
                propertyWeightDictonary: collectionIndexEntryData.propertyWeightDictonary,
                averageLength: collectionIndexEntryData.averageLength,
            },
            documentScoreDictonary
            )
        );
    }
    await Promise.all(searchForTokenPromises);
    return createSortedListOfDocumentIdsFromDocumentScoreDictonary(documentScoreDictonary);
}

async function searchForToken(data: SearchForTokenData, globalDocumentScoreDictonary: DocumentScoreDictonary) {
    const localDocumentScoreDictonary = await callSearchForTokenCloudFunction(data);
    mergeDocumentScoreDictonarys(localDocumentScoreDictonary, globalDocumentScoreDictonary);
}

async function callSearchForTokenCloudFunction(body: SearchForTokenData) {
    try {
        const result = await rpn({
            method: 'POST',
            uri: 'https://us-central1-irengine-fd40f.cloudfunctions.net/searchForToken',
            body,
            json: true,
        });
        if (isDocumentScoreDictonary(result)) {
            return result;
        } else {
            throw new functions.https.HttpsError('internal', '...');
        }
    } catch (err) {
        throw new functions.https.HttpsError('internal', '...');
    }
}

function isValidRequest(candidate: functions.Request) { 
    if (!(candidate.query.c && isCollectionKey(candidate.query.c))) {
        return false;
    }
    if (!(candidate.query.q && isString(candidate.query.q))) {
        return false;
    }
    return true;
}

function isCollectionKey(candidate: any) {
    return true
}

async function preProcessSearchString(queryString: string) {
    try {
        return await SemanticParser.parse(queryString);
    } catch (err) {
        throw new functions.https.HttpsError('internal', '...');
    }
}