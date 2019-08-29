import Cache from "../../../dataStructures/cache";
import { getCollectionIndexEntryReference } from "../collectionIndexEntry";
import getDataFromReference from "../../../utilities/getDataFromReference";

export interface DocumentIndexEntry {
    status: number,
    length: number,
}

export function isDocumentIndexEntry(candidate: any): candidate is DocumentIndexEntry {
    return true;
}

function getDocumentIndexReference() {
    return getCollectionIndexEntryReference().collection('documentIndex');
}

export function getCachedDocumentIndexEntryReference(): FirebaseFirestore.DocumentReference {
    return getDocumentIndexReference().doc(Cache.getDocumentId());
}

export async function getDocumentIndexEntryDataByDocumentId(documentId: string) {
    return await getDataFromReference(
        getDocumentIndexReference().doc(documentId),
        isDocumentIndexEntry,
    ) as DocumentIndexEntry;
}

export async function deleteDocumentIndexEntry() {
    await getCachedDocumentIndexEntryReference().delete();
}

export function addDocumentToDocumentIndex(transaction: FirebaseFirestore.Transaction) {
    transaction.create(
        getCachedDocumentIndexEntryReference(),
        {
            status: 0,
            length: Cache.getDocumentLength(),
        }
    );
}