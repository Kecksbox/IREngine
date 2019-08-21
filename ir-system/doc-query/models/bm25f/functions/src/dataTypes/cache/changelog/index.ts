import Document from "../../collection/document";

enum OperationType {
    set = 0,
    delete,
}

class Changelog<D extends Document> {

    public constructor(private document: D, private operation: OperationType = OperationType.set) {

    }

    public getDocument() {
        return this.document;
    }

    public getOperation() {
        return this.operation;
    }

    public setOperation(opType: OperationType) {
        this.operation = opType;
    }

}

export {
    Changelog,
    OperationType,
}