import Resp from '../helpers/Resp.mjs'
import {formatDate} from "../tools.js";
import formValid from "../modules/formValid/index.js";

export default {
    changePage(context, page) {
        context.state.page = page;
        context.state.pageHistory.push({page, date: formatDate()});
        if (context.state.pageHistory.length > 10) {
            context.state.pageHistory.shift();
        }
        return true;
    },
    async getFormValid(context) {
        return Resp.success(formValid);
    }
}