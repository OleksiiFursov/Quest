export default {
    init(context){
        if(!context.store.complaint){
            context.store.complaint = {};
        }
    },
    watchMysql(context, e) {
        if (context.store.page === '/home' && e.table === 'rma_system_applications') {
            context.config.isLog && context.notice('Changed table "rma_system_applications"');
            this.getStats(context);
        }

        if(e.table.includes('rma_')){

            if(context.store.page === '/complaints'){
                context.emit('complaint.list.isUpdate',{
                    event: e,
                });
            }
            if(~context.store.page.search(/\/complaint\/[0-9]+/) ){

                const id = context.store.page.split('/').pop();
                if(+e.affectedRows[0].before.application_id === +id || (e.table === 'rma_system_applications' && +e.affectedRows[0].before.id === +id))
                    context.emit('complaint.view.isUpdate', {
                        event: e,
                        data: {id}
                    });
            }
        }

    },
    changeCountry(context, country){
        context.store.complaint.country = country;
    },
    getStats(context) {
        const namespace = 'Complaint->getStats: ';
        context.db.query("SELECT * FROM `reports` WHERE id=13 AND status=1", (err, query) => {
            if (err) {
                context.config.isDev && context.error(namespace + err);
                return 0;
            }

            query = query?.[0]?.query;
            if (!query) {
                context.config.isDev && context.error(namespace + "Not record");
                return 0;
            }

            context.db.query(query.replace(/{country_code}/g, ' = ' + context.db.escape(context.store.complaint_country || 'PL') + ''), (err, result) => {

                if (err) {
                    context.config.isDev && context.error(namespace + err);
                    return 0;
                }

                context.emit('complaint.getStats', result);

            })
        });

    }


}
