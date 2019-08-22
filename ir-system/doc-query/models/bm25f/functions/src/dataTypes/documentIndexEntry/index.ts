import Cache from "../../dataStructures/cache";
import { getCollectionIndexEntryReference } from "../collectionIndexEntry";

interface DocumentIndexEntry {
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