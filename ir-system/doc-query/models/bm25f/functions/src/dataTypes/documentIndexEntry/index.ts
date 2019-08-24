import Cache from "../../dataStructures/cache";
import { getCollectionIndexEntryReference } from "../collectionIndexEntry";

export interface DocumentIndexEntry {
    status: number,
    length: number,
}

export function isDocumentIndexEntry(candidate: any): candidate is DocumentIndexEntry {
    return true;
}

export function getDocumentIndexEntryReference(): FirebaseFirestore.DocumentReference {
    return getCollectionIndexEntryReference().collection('documentIndex').doc(Cache.getContext().params.docId);
}

export async function deleteDocumentIndexEntry() {
    await getDocumentIndexEntryReference().delete();
}

export async function addDocumentToDocumentIndex() {
    await getDocumentIndexEntryReference().create({
        status: 0,
        length: Cache.getDocumentLength(),
    });
}