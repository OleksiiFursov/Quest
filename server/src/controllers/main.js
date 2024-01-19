import Resp from '../helpers/Resp.mjs'
import { formatDate, getCurrentDirectory, importFolder } from '../tools.js'

export default {
    changePage(context, page) {
        context.state.page = page;
        context.state.pageHistory.push({page, date: formatDate()});
        if (context.state.pageHistory.length > 10) {
            context.state.pageHistory.shift();
        }
        return true;
    },
    async getFormValid() {
        return Resp.success(await importFolder(getCurrentDirectory()+'/modules/formValid/form', 'default'));
    }
}
