import {formatDate, makeSize, merge, normalizeObject} from "../tools.mjs";


export default {
    __formatMemory() {
        const memory = process.memoryUsage();
        for(const key in memory){
            memory[key] = makeSize(memory[key]);
        }
        return memory;
    },
    getData(context) {
        return normalizeObject(context.data);
    },
    getNodeVersion() {
        return process.versions;
    },
    setUsersLog(context, data) {
        const name = data['name'] || 'all';
        context.data.usersLogs[name].push(
            {
                message: data.message || '',
                date: formatDate(),
                role: context.store.role || null,
                page: context.store.page,
                id: context.store.id,
                history: context.store.pageHistory || [],
                username: context.store.username

            })
    },

    getUsersLogs(context, name) {
        if(name){
            return context.data.usersLogs[name];
        }else{
            return context.data.usersLogs;
        }
    },
    getMemory(context) {
        return context.emit('system.memory', this.__formatMemory());
    },
    getMemoryOrg() {
        return process.memoryUsage();
    },
    gc() {
        return global.gc();
    },
    getStats(context) {
        return context.emit('system.stats', context.data.stats);
    },
    getLogs(context) {
        return context.emit('system.logs', context.data.logs);
    },
    getStatusDB(context) {
        return context.emit('system.getStatusDB', {
            status: context.db.state,
        });
    },
    clearStats(context) {
        context.data.stats = {
            maxOnline: 0,
            allConnect: 0,
            startMemory: this.__formatMemory(),
            startDate: formatDate(),
            all: {}
        };
        return true;
    },
    clearLog(context) {
        context.data.logs = [];
        return true;
    },
    clear(context) {
        this.clearStats(context);
        this.clearLog(context);
        this.clearError(context);
        return true;
    },
    setError(context, data) {
        context.data.errors.push({
            date: formatDate(),
            data
        });
        return context.emit('system.errors', context.data.errors);
    },
    clearError(context) {
        context.data.errors = [];
        return true;
    },

    getErrors(context) {
        return context.emit('system.errors', context.data.errors);
    },
    getFrontVersion(context) {
        return context.data.frontVersion;
    },
    setConfig(context, data) {
        context.config = merge(context.config, data);
        return context.config
    },
    getStore(context) {
        return context.store;
    },
    setSystemMessage(context, data) {
        return context.emit('allMessage', data, true);
    },

}
