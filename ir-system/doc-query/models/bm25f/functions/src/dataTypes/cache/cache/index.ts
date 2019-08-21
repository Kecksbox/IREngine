import * as functions from 'firebase-functions';

import CollectionIndexEntry from '../../collection/document/docTypes/collectionIndexEntry';
import { Changelog } from '../changelog';
import DocumentIndexEntry from '../../collection/document/docTypes/documentIndexEntry';
import LexicalEntry from '../../collection/document/docTypes/lexicalEntry';
import Collection from '../../collection';

class Cache {

    private static instance: Cache;

    public static getInstance() {
        if (! this.instance) {
            throw new functions.https.HttpsError('internal', 'Get Instance can not be used before initialization.');
        }
        return this.instance;
    }

    private collID: string;

    private docID: string;

    private triggerDocument: FirebaseFirestore.DocumentSnapshot;

    private collIndexEntry: Changelog<CollectionIndexEntry>;

    private collIndexEntry: Changelog<DocumentIndexEntry>;

    private lexicon: Collection<LexicalEntry>;

    private hitBin: ;

}