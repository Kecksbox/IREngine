import * as functions from 'firebase-functions';

import Document from "./document";
import { Changelog } from "../cache/changelog";

interface DocDict<D extends Document> {
    [key: string]: Changelog<D>;
}   

class Collection<D extends Document> {

    private docDict: DocDict<D> = {};
    
    public addDocument(doc: Changelog<D>) {
        const docId = doc.getDocument().getId();
        if (this.docDict.hasOwnProperty(docId)) {
            throw new functions.https.HttpsError('internal', 'The document id already exists in the local representation of the collection.');
        }
        this.docDict[docId] = doc;
    }

    public getDocument(id: string) {
        return this.docDict[id];
    }

}

export default Collection;