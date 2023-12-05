export default {
    watchMysql(context, e) {
        if (e.table === 'notification') {
            context.config.isLog && context.notice('Changed table "notification"');
            context.emit('changeNotification', {
                event: e
            });
        }
        if (e.table === 'notification_recipient' && e.affectedRows.find(v=> v.after.user_id === context.store.id)) {
            context.config.isLog && context.notice('Changed table "notification_recipient"');
            context.emit('changeNotificationRecipient', {
                event: e
            });
        }
    }
}
