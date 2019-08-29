import Trigger from "..";
import addAction from "../../actions/IndexActions/addAction";

export default new Trigger(
    async () => addAction()
);