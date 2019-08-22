import * as functions from 'firebase-functions';
import { PropertyWeightDictonary } from '../../dataTypes/collectionIndexEntry';
import { SeenLemmaOverview } from '../../dataTypes/lexicalEntry';

class Cache {

    private static instance: Cache;

    public static getContext(): functions.EventContext {
        return this.loadProperty('context');
    }

    public static getTriggerDocumentSnapshot(): FirebaseFirestore.DocumentSnapshot {
        return this.loadProperty('triggerDocumentSnapshot');
    }

    public static getLocalPropertyWeightDictonary(): PropertyWeightDictonary {
        return this.saveLoadProperty('localPropertyWeightDictonary', {});
    }

    public static getSeenLemmaOverview(): SeenLemmaOverview {
        return this.saveLoadProperty('seenLemmaOverview', {});
    }

    public static setDocumentLength(newLength: number) {
        this.getDocumentLength();
        (this.getInstance() as any)['documentLength'] = newLength;
    }

    public static getDocumentLength(): number {
        return this.saveLoadProperty('documentLength', 0);
    }

    public static refresh(snap: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
        const clearInstance = this.clear();
        clearInstance.assignOnceToProperty('context', context);
        clearInstance.assignOnceToProperty('triggerDocumentSnapshot', snap);
    }

    private static clear() {
        this.instance = new Cache();
        return this.instance;
    }

    private static loadProperty(propertyName: string) {
        const instance = this.getInstance();
        if (!(instance as any)[propertyName]) {
            throw new functions.https.HttpsError('internal', `The property ${propertyName} you want to load has not yet been defined.`);
        }
        return (instance as any)[propertyName];
    }

    public static saveLoadProperty(propertyName: string, defaultValue: any) {
        const instance = this.getInstance();
        if (!(instance as any)[propertyName]) {
            (instance as any)[propertyName] = defaultValue;
        }
        return this.loadProperty(propertyName);
    }

    private static getInstance() {
        if (!this.instance) {
            throw new functions.https.HttpsError('internal', 'Get Instance can not be used before initialization.');
        }
        return this.instance;
    }

    private assignOnceToProperty(propertyName: string, element: any) {
        if ((this as any)[propertyName] !== undefined) {
            throw new functions.https.HttpsError('internal', 'An attempt is made to change a uniquely assignable property. This is unwanted behavior.');
        }
        (this as any)[propertyName] = element;
    }

}

export default Cache;