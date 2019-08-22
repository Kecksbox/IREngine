import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import deleteTrigger from './collectionTriggers/deleteTrigger';

admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

exports.createBM25FCallback = functions.firestore.document('collectionIndex/{collId}/collection/{docId}').onCreate(createCallback);

exports.updateBM25FCallback = functions.firestore.document('collectionIndex/{collId}/collection/{docId}').onUpdate(updateCallback);

exports.deleteBM25FCallback = functions.firestore.document('collectionIndex/{collId}/collection/{docId}').onDelete(deleteTrigger.call);