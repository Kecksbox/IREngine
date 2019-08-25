import Trigger from "..";
import addAction from "../../actions/addAction";
import deleteAction from "../../actions/deleteAction";

export default new Trigger(
    async () =>  {
        await deleteAction();
        await addAction();
    }
);