import * as functions from 'firebase-functions';
import { isFunction } from 'util';

export default async function getDataFromReference(ref: FirebaseFirestore.DocumentReference | FirebaseFirestore.Query, validator: (candidate: any) => boolean) {
    console.log('searched for:', ref)
    const result = await ref.get();
    let resultData;
    console.log(result);
    console.log('instance of DocumentSnapshot:', isDocumentSnapshot(result));
    if (isDocumentSnapshot(result)) {
        console.log('document');
        resultData = result.data();
    } else {
        console.log('query');
        resultData = [];
        console.log('passed down data:', result.docs);
        for (let i = 0, len = result.docs.length; i < len; ++i) {
            console.log('triying to get data from:', resultData[i]);
            resultData[i] = result.docs[i].data();
        }
    }
    if (resultData !== undefined && validator(resultData)) {
        console.log('validator says:', validator(resultData));
        return resultData;
    } else {
        throw new functions.https.HttpsError('internal', '...');
    }
}

function isDocumentSnapshot(candidate: any): candidate is FirebaseFirestore.DocumentSnapshot {
    return isFunction(candidate.data);
}