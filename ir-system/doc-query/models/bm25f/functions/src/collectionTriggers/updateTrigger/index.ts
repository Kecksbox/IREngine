import Trigger from "..";
import addAction from "../../actions/IndexActions/addAction";
import deleteAction from "../../actions/IndexActions/deleteAction";

export default new Trigger(
    async () =>  {
        await deleteAction();
        await addAction();
    }
);