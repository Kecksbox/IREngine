import Cache from "../../dataStructures/cache";
import { getLexiconReference, isLexicalEntry } from "../../dataTypes/lexicalEntry";
import { db } from "../..";

/*

1. Count Hits
   (while counting hits build the propWeightDict, calculate docs length and upadate lexicon)
   (we create new propWeightDict in memory and merge it later with the existing one)
   (we keep a list of seen lemmas to all of ther lexicalEntry later)


*/

export default async () => {
    await countHits();
    updateLexicon();
}

async function updateLexicon() {
    const seenLemmaOverview = Cache.getSeenLemmaOverview();
    for(const lemma in seenLemmaOverview) {
        if (seenLemmaOverview.hasOwnProperty(lemma) && seenLemmaOverview[lemma]) {
            db.runTransaction(async transaction => {
                return transaction.get(getLexiconReference().doc(lemma)).then(lexicalEntry => {
                    if (!lexicalEntry.exists) {
                        transaction.set(
                            lexicalEntry.ref,
                            {
                                
                            }
                        )
                    }
                    const lexicalEntryData = lexicalEntry.data();
                    if (isLexicalEntry(lexicalEntryData)) {
                        
                    } else {
                        throw new functions.https.HttpsError('internal', '...');
                    }
                });
            });
        }
    }
}