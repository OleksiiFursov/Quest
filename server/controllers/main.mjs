import {formatDate} from "../tools.mjs";

export default {
    watchMysql(context, e) {
        if (e.table === 'vocabulary' || e.table === 'vocabulary_translations') {
            context.config.isLog && context.notice('Changed table "vocabulary" or "vocabulary_translations"');
            context.emit('changeVocabulary');
        }

        // translation:
        if (e.table === 'translation') {
            const res = {};
            for (const {after: item} of e.affectedRows) {
                if (context.store.lang === item.language && ['front', 'front.' + context.store.application].includes(item.context)) {
                    res[item.slug] = item.translation;
                }
            }
            context.config.isLog && context.notice('Changed table "translation"');
            context.emit('changeTranslationItems', {
                event: e,
                changed: {...res}
            });
        }

    },
    changePage(context, page) {
        context.store.page = page;
        context.store.pageHistory.push({page, date: formatDate()});
        if (context.store.pageHistory.length > 10) {
            context.store.pageHistory.shift();
        }
        return true;
    }
}
