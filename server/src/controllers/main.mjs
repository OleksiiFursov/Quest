import {formatDate} from "../tools.mjs";

export default {
    changePage(context, page) {
        context.state.page = page;
        context.state.pageHistory.push({page, date: formatDate()});
        if (context.state.pageHistory.length > 10) {
            context.state.pageHistory.shift();
        }
        return true;
    },
    formValid(context, form) {
        Resp
    }
}
