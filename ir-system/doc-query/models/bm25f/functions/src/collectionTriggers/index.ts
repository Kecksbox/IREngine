import * as functions from 'firebase-functions';

import Cache from "../dataStructures/cache";

class Trigger {

    public constructor(private callBack: () => void) {

    }

    public call(snap: FirebaseFirestore.DocumentSnapshot, context: functions.EventContext) {
        Cache.refresh(snap, context);
        this.callBack();
    }

}

export default Trigger;