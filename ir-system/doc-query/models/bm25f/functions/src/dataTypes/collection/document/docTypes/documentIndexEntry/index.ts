import Document from "../..";

class DocumentIndexEntry extends Document {

    // @ts-ignore
    private status: number;

    // @ts-ignore
    private docLength: number;

    public getStatus() {
        return this.status;
    }

    public getDocLength() {
        return this.docLength;
    }

    protected parseData(data: FirebaseFirestore.DocumentData) {
        this.parseNumberProperty('status', data);
        this.parseNumberProperty('docLength', data);
    }

}

export default DocumentIndexEntry;