import * as functions from 'firebase-functions';

import { SearchForTokenData, isSearchForTokenData } from '../searchForToken';
import { isString, isNumber } from 'util';
import { getHitsByDocumentAndLemma } from '../../../dataTypes/documentTypes/hitBinEntry';
import resolveDeepKey from '../../../utilities/resolveDeepKey';
import Cache from '../../../dataStructures/cache';

export interface ComputeFijScoreData extends SearchForTokenData {
    documentId: string,
}

export async function computeFijScoreForDocumentAction(request: functions.Request, response: functions.Response) {
    const data = request.body;
    console.log('reached computeFijScore:', data);
    if (isComputeFijScoreData(data)) {

        Cache.refreshByCollectionId(data.collectionId);

        const hits = await getHitsByDocumentAndLemma(data.documentId, data.searchTokens[data.index].lemma);

        let score = 0;
        for(const hit of hits) {
            console.log('trying to resolve: ', hit);
            console.log('in:', data.propertyWeightDictonary);
            const weight = resolveDeepKey(hit.property, data.propertyWeightDictonary);
            if (isNumber(weight)) {
                // REPLACE 1 WITH THE SYNTACTIC MATCH SCORE ...
                score += weight * 1;
            } else {
                throw new functions.https.HttpsError('internal', '...');
            }
        }
        console.log('finished computing score:', score);
        console.log('should die now');
        return response.status(200).send(score);
    } else {
        throw new functions.https.HttpsError('internal', '...');
    }
}

function isComputeFijScoreData(candidate: any): candidate is ComputeFijScoreData {
    if (!(candidate.hasOwnProperty('documentId') && isString(candidate.documentId))) {
        return false;
    }
    if (!isSearchForTokenData(candidate)) {
        return false;
    }
    return true;
}