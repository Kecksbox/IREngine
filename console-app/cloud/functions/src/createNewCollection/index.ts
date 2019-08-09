import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as uuidAPIKey from 'uuid-apikey';
import { db } from '..';

export const createNewCollectionIntern = async (data: any, context: functions.https.CallableContext) => {
    if (isValidCollectionFormState(data) === false) {
        throw new functions.https.HttpsError('invalid-argument', '...');
    }
    if (context.auth === undefined) {
        throw new functions.https.HttpsError('invalid-argument', '...');
    }
    const keyPair = callculateNewCollectionKey();
    await addCollectionToCollectionIndex(keyPair.uuid, data.name);
    await addCollectionToCurrentUser(context.auth.uid, data.name, keyPair.uuid);
}

function isValidCollectionFormState(data: any) {
    return (data.hasOwnProperty('selected') && typeof data.selected === 'string' && ['local', 'firebase', 'mongoDB'].includes(data.selected))
    && (data.hasOwnProperty('name') && typeof data.name === 'string' && data.name.length <= 20);
}

function callculateNewCollectionKey() {
    return uuidAPIKey.create();
}

async function addCollectionToCollectionIndex(uuid: string, name: string) {
    const collectionDocRef = db.collection('collectionIndex').doc(uuid);
    const collectionDoc = await collectionDocRef.get();
    if (collectionDoc.exists) {
        throw new functions.https.HttpsError('invalid-argument', '...');
    }
    await collectionDocRef.set({
        name,
    });
}

async function addCollectionToCurrentUser(uid: string, name: string, uuid: string) {
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    if (userDoc.exists === false) {
        await userDocRef.set({
            collections: [],
        });
    }
    await userDocRef.update({
        collections: admin.firestore.FieldValue.arrayUnion({
            name,
            uuid,
        })
    });
}

