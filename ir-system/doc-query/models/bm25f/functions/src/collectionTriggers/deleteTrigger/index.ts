import Trigger from "..";
import deleteAction from "../../actions/deleteAction";

export default new Trigger(
    async () => deleteAction()
);