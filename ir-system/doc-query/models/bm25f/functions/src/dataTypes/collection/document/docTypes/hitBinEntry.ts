import * as functions from 'firebase-functions';

import Document from "..";
import isObject from "../../../../helperFunctions/isObject";
import { isString, isBoolean, isArray } from 'util';

interface SemanticProperties {
    pos: string,
    tag: string,
    dep: string,
    stop: boolean,
    punc: boolean,
    children: string[],
}

class HitBinEntry extends Document {

    private documentId: string;

    private property: string;

    private lemma: string;

    private text: string;

    private sematicProperties: SemanticProperties;

    protected parseData(data: FirebaseFirestore.DocumentData) {
        this.parseStringProperty('documentId', data);
        this.parseStringProperty('property', data);
        this.parseStringProperty('lemma', data);
        this.parseStringProperty('text', data);
        this.parseSemanticProperties(data);
    }

    private parseSemanticProperties(data: FirebaseFirestore.DocumentData) {
        if (data.hasOwnProperty('sematicProperties') && isObject(data.sematicProperties)) {
            if (this.areValidSemanticProperties(data.sematicProperties)) {
                this.sematicProperties = data.sematicProperties;
            } else {
                throw new functions.https.HttpsError('internal', 'The semantic properties of the hit do not meet all type conventions. So they are not valid.');
            }
        } else {
            throw new functions.https.HttpsError('internal', 'The semantic properties of the hit are either not set or not an object.');
        }
    }

    private areValidSemanticProperties(sematicProperties: any): sematicProperties is SemanticProperties {
        return (
            (sematicProperties.hasOwnProperty('pos') && isString(sematicProperties.pos))
            && (sematicProperties.hasOwnProperty('tag') && isString(sematicProperties.tag))
            && (sematicProperties.hasOwnProperty('dep') && isString(sematicProperties.dep))
            && (sematicProperties.hasOwnProperty('stop') && isBoolean(sematicProperties.stop))
            && (sematicProperties.hasOwnProperty('punc') && isBoolean(sematicProperties.punc))
            && (sematicProperties.hasOwnProperty('children') && isArray(sematicProperties.children) && !sematicProperties.children.some(isString))
        ) === false;
    }

}