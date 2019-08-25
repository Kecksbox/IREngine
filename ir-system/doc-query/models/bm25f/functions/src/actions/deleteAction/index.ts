import { removeFromCollectionIndexEntry } from "../../dataTypes/collectionIndexEntry";
import { deleteDocumentIndexEntry } from '../../dataTypes/documentIndexEntry';
import { removeDocumentToBeDeletedFromAllAssociatedLexiconEntries } from '../../dataTypes/lexicalEntry';
import { removeAllHitsAssociatedWithTheDocumentToBeDeleted } from '../../dataTypes/hitBinEntry';

/*

1. Update the CollIndexEntry by reducing the number of documents by 1. 
   (Properties of the PropObj should be garbageCleaned in a separate process.)

2. Load leikon entries. In all these documents the idf score is adjusted, the docCount is reduced by 1 and the document to be deleted is removed from the contained documents.
3. Load hits for the document to be deleted. All these documents will be deleted.

4. Update the DocIndex by deleting the corresponding document.

*/

export default async () => {
    await removeFromCollectionIndexEntry();
    await removeDocumentToBeDeletedFromAllAssociatedLexiconEntries();
    await removeAllHitsAssociatedWithTheDocumentToBeDeleted();
    await deleteDocumentIndexEntry();
}