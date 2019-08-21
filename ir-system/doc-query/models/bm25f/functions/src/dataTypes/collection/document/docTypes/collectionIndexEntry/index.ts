import Document from '../..';

class CollectionIndexEntry extends Document {

    // @ts-ignore
    private name: string;

    // @ts-ignore
    private docCount: number;

    // @ts-ignore
    private avgLength: number;

    // @ts-ignore
    private propWeightDict: object;

    public getName() {
        return this.name;
    }

    public getDocCount() {
        return this.docCount;
    }

    public getAvgLength() {
        return this.avgLength;
    }

    public getPropWeightDict() {
        return this.propWeightDict;
    }

    protected parseData(data: FirebaseFirestore.DocumentData) {
        this.parseStringProperty('name', data);
        this.parseNumberProperty('docCount', data);
        this.parseNumberProperty('avgLength', data);
        this.parseObjectProperty('propWeightDict', data);
    }

}

export default CollectionIndexEntry;