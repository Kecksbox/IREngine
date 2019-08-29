import * as functions from 'firebase-functions';

import Cache from "../dataStructures/cache";

class Trigger {

    public constructor(private callBack: () => Promise<void>) {
        this.call = this.call.bind(this);
    }

    public async call(snap: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
        Cache.refreshBySnapAndContext(snap, context);
        await this.callBack();
    }

}

export default Trigger;