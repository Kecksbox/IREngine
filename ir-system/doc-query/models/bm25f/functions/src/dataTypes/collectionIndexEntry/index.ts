interface PropertyWeightDictonary {
    [key: string]: PropertyWeightDictonary | number,
}

interface CollectionIndexEntry {
    name: string,
    documentCount: number,
    averageLength: number,
    propertyWeightDictonary: PropertyWeightDictonary,
}

export function isCollectionIndexEntry(candidate: any): candidate is CollectionIndexEntry {
    return true;
}