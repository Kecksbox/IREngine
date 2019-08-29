import Trigger from "..";
import deleteAction from "../../actions/IndexActions/deleteAction";

export default new Trigger(
    async () => deleteAction()
);