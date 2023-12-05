import {makeDate} from "../tools.mjs";

export default {
    __formatUser(store, token, date, online = true) {
        return {
            id: store.id,
            username: store.username ?? 'guest',
            role: store.role,
            page: store.page,
            client: {...store.client},
            frontVersion: store.frontVersion,
            connectDuration: (online ?
                makeDate(new Date() - (date || new Date().valueOf())) :
                store.sessionEnd),
            token,
            online: online || false
        };
    },
    find(context, filters) {
        const keysFilter = Object.keys(filters);
        const users = [];
        const usersAll = this.getAll(context);
            for(const token in usersAll){
                for(let i = 0; i < keysFilter.length; i++){
                    if(typeof filters[keysFilter[i]] === 'object'){
                        if((filters[keysFilter[i]]).includes(usersAll[token][keysFilter[i]])){
                            users.push(usersAll[token]);
                        }
                    }else{
                        if(filters[keysFilter[i]] === usersAll[token][keysFilter[i]]){
                            users.push(usersAll[token]);
                        }
                    }
                }
            }

        return context.emit('system.getUser', users);
    },
    get(context) {
        const users = []
        for(let token in context.users){
            const _store = context.users[token].store;
            users.push(this.__formatUser(_store, token, context.users[token].date))
        }
        return context.emit('users.online', users);
    },
    getAll(context, isReturnEmit=true) {
        const users = [],
            usernames = [];

        for(let token in context.users){
            const _store = context.users[token].store;
            if(_store?.username && _store?.username !== 'guest'){
                usernames.push(_store?.username);
            }
            users.push(this.__formatUser(_store, token, context.users[token].date))
        }

        context.data.usersDisconnect.forEach((store, username) => {
            if(!usernames.includes(username)){
                users.push(this.__formatUser(store, username, store.date, false))
            }
        });
        if(isReturnEmit)
            return context.emit('users.getAll', users);
        else
            return users;
    }
}