import { addDocumentToLexiconEntry } from "../../dataTypes/lexicalEntry";
import { countHits } from "../../dataTypes/hitBinEntry";
import { addDocumentToDocumentIndex } from "../../dataTypes/documentIndexEntry";
import { addDocumentToCollectionIndex } from "../../dataTypes/collectionIndexEntry";

/*

1. Count Hits
   (while counting hits build the propWeightDict, calculate docs length and upadate lexicon)
   (we create new propWeightDict in memory and merge it later with the existing one)
   (we keep a list of seen lemmas to all of ther lexicalEntry later)

2. Add a new Entry to the DocumentIndex.
3. Update the Collection Index by increasing the total number of documents by 1, 
   adding the PropertyWeightDictonary and adjusting the average length.
4. Update the lexicon by adjusting or creating the corresponding entry for each lemma seen.

*/

export default async () => {
    await countHits();
    await addDocumentToDocumentIndex();
    await addDocumentToCollectionIndex();;
    await addDocumentToLexiconEntry();
}