import * as functions from 'firebase-functions';
import * as rpn from 'request-promise-native';

import { isArray } from 'util';

interface SemanticProperties {
    pos: string,
    tag: string,
    dep: string,
    stop: boolean,
    punc: boolean,
    children: string[],
}

export interface Token {
    lemma: string,
    text: string,
    sematicProperties: SemanticProperties,
}

export function isValidToken(candidate: any): candidate is Token {
    return true;
}

export class SemanticParser {

    public static async parse(text: string) {
        console.log('reached parser with text:', text);
        try {
            const result = await rpn({
                method: 'POST',
                uri: 'https://us-central1-irengine-fd40f.cloudfunctions.net/semanticParsing',
                body: {
                    text,
                },
                json: true,
            });
            console.log('returned something');
            if (this.isValidResult(result)) {
                return result;
            } else {
                throw new functions.https.HttpsError('internal', 'invalid result');
            }
        } catch (err) {
            throw new functions.https.HttpsError('internal', 'failed to parse');
        }
    }

    private static isValidResult(result: any): result is Token[] {
        if (isArray(result) === false) {
            return false;
        }
        for (const token of result) {
            if (isValidToken(token) === false) {
                return false;
            }
        }
        return true;
    }

}