interface DocumentIndexEntry {
    status: number,
    length: number,
}

export function isDocumentIndexEntry(candidate: any): candidate is DocumentIndexEntry {
    return true;
}