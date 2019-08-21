import * as functions from 'firebase-functions';
import isObject from '../../../helperFunctions/isObject';
import { isString } from 'util';

interface Validator {
    validatorFunction: (elem: any) => boolean,
    type: string,
}

abstract class Document {

    private id: string;

    private ref: FirebaseFirestore.DocumentReference;

    // To-Do: Add some checks
    protected constructor(snap: FirebaseFirestore.DocumentSnapshot) {
        this.id = snap.id
        this.ref = snap.ref;

        const snapData = this.getDataFromSnapShot(snap);

        this.parseData(snapData);
    }

    public getId() {
        return this.id;
    }

    public getRef() {
        return this.ref;
    }

    protected getDataFromSnapShot(snap: FirebaseFirestore.DocumentSnapshot) {
        const data = snap.data();
        if (data === undefined) {
            return {};
        } else {
            return data;
        }
    }

    protected abstract parseData(data: FirebaseFirestore.DocumentData) : void;

    protected parseStringProperty(propName: string, data: FirebaseFirestore.DocumentData, defaultValue: string | undefined = undefined) {
        this.parseProperty(
            propName, 
            data, 
            defaultValue,
            {
                validatorFunction: isString, 
                type: 'string',
            });
    }

    protected parseNumberProperty(propName: string, data: FirebaseFirestore.DocumentData) {
        this.parseProperty(
            propName, 
            data, 
            0,
            {
                validatorFunction: isNaN, 
                type: 'number',
            });
    }

    protected parseObjectProperty(propName: string, data: FirebaseFirestore.DocumentData) {
        this.parseProperty(
            propName, 
            data, 
            {},
            {
                validatorFunction: isObject, 
                type: 'object',
            });
    }

    protected parseProperty(propName: string, data: FirebaseFirestore.DocumentData, defaultValue: any, validator: Validator) {
        if (this.hasOwnProperty(propName) === false) {
            throw new functions.https.HttpsError('internal', 'The given property does not exist in the target.');
        }
        if (data.hasOwnProperty(propName) === false) {
            if (defaultValue === undefined) {
                throw new functions.https.HttpsError('data-loss', 'This property must have a value, since no default can be determined.');
            }
            (this as any)[propName] = defaultValue;
        } else {
            if (validator.validatorFunction(data[propName])) {
                throw new functions.https.HttpsError('data-loss', `The document contains a value for ${propName} that is not a ${validator.type}.`);
            }
            (this as any)[propName] = data[propName];
        }
    }

}

export default Document;