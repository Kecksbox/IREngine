export interface DocumentScoreDictonary {
    [key: string]: number,
}

export function isDocumentScoreDictonary(candidate: any): candidate is DocumentScoreDictonary {
    return true;
}

export function mergeDocumentScoreDictonarys(from: DocumentScoreDictonary, to: DocumentScoreDictonary) {
    for (const key in from) {
        if (from.hasOwnProperty(key)) {
            if (!to.hasOwnProperty(key)) {
                to[key] = 0;
            }
            to[key] += from[key];
        }
    }
}

export function createSortedListOfDocumentIdsFromDocumentScoreDictonary(documentScoreDictonary: DocumentScoreDictonary) {
    return Object.keys(documentScoreDictonary).sort((a, b) => { return documentScoreDictonary[b] - documentScoreDictonary[a] })
}