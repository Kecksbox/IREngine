import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { createNewCollectionIntern } from './createNewCollection';

export const db = admin.initializeApp(functions.config().firebase).firestore();

export const createNewCollection = functions.https.onCall(createNewCollectionIntern);