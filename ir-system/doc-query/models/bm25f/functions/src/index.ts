import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import deleteTrigger from './collectionTriggers/deleteTrigger';
import addTrigger from './collectionTriggers/addTrigger';
import updateTrigger from './collectionTriggers/updateTrigger';

admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

exports.createBM25FCallback = functions.firestore.document('collectionIndex/{collId}/collection/{docId}').onCreate(addTrigger.call);

exports.updateBM25FCallback = functions.firestore.document('collectionIndex/{collId}/collection/{docId}').onUpdate((change, context) => updateTrigger.call(change.after, context));

exports.deleteBM25FCallback = functions.firestore.document('collectionIndex/{collId}/collection/{docId}').onDelete(deleteTrigger.call);