import {formatDate} from "../tools.mjs";

export default {
    changePage(context, page) {
        context.store.page = page;
        context.store.pageHistory.push({page, date: formatDate()});
        if (context.store.pageHistory.length > 10) {
            context.store.pageHistory.shift();
        }
        return true;
    }
}
