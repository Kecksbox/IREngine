import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createCallback } from './collectionTriggers';

admin.initializeApp(functions.config().firebase);

export const db = admin.firestore();

exports.createBM25FCallback = functions.firestore.document('collectionIndex/{collID}/collection/{docID}').onCreate(createCallback);

exports.createBM25FCallback = functions.firestore.document('collectionIndex/{collID}/collection/{docID}').onUpdate(updateCallback);

exports.createBM25FCallback = functions.firestore.document('collectionIndex/{collID}/collection/{docID}').onUpdate(deleteCallback);