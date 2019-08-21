import Document from "../..";

interface ParticipatingDocumentsOverview {
    [key: string]: boolean,
}

class LexicalEntry extends Document {

    // @ts-ignore
    private idf: number;

    // @ts-ignore
    private docCount: number;

    // @ts-ignore
    private docsContainingLemma: ParticipatingDocumentsOverview;

    public getIdf() {
        return this.idf;
    }

    public getDocCount() {
        return this.docCount;
    }

    public getDocsContainingLemma() {
        return this.docsContainingLemma;
    }

    protected parseData(data: FirebaseFirestore.DocumentData) {
        this.parseNumberProperty('idf', data);
        this.parseNumberProperty('docCount', data);
        this.parseObjectProperty('docsContainingLemma', data);
    }

}

export default LexicalEntry;