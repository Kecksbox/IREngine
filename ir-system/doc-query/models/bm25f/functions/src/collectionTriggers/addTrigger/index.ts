import Trigger from "..";
import addAction from "../../actions/addAction";

export default new Trigger(
    async () => addAction()
);