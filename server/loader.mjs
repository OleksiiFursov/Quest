import config from "./config.mjs";
import complaintController from './controllers/complaint.mjs';
import mainController from './controllers/main.mjs';
import systemController from './controllers/system.mjs';
import usersController from './controllers/users.mjs';
import notificationController from './controllers/notification.mjs';
import {deepClone} from "./tools.mjs";


const controllers = {complaintController, mainController, systemController, usersController, notificationController},
    controllerList = Object.values(controllers);

export const controllersWatch = (context, users, event) => {
    if(config.mysqlWatch.includeTable && !(config.mysqlWatch?.includeTable || []).includes(event.table) ||
        (config?.mysqlWatch?.excludeTable || []).includes(event.table)
    ){
        return false;
    }
    context().config.isLog && context().notice(event);

    if(event.timestamp === context().data.watchLast[event.table]) return 0;
    context().data.watchLast[event.table] = event.timestamp;

    Object.keys(users).forEach(name => {
        let $context = context(name);
        for(const controller of controllerList){
            controller?.watchMysql?.($context, event)
        }
       $context = null;
    });

}

export const controllersInit = context => {
    for(const controller of controllerList){
        if(controller.init){
            controller.init(context);
        }
    }
}


export const controllersOn = (context, message) => {
    let {name, data} = JSON.parse(message);
    if(!name || !name.length) return this;
    context.config.isLog && context.notice(message);
    if(name === 'set'){
        context.store = Object.assign(context.store, data);

        if(context.data.usersWatcher.online.size){
            let usersStore = [];
            for(const token in context.users){
                usersStore.push(usersController.__formatUser(deepClone(context.users[token].store), token, context.users[token].date));
            }

            context.data.usersWatcher.online.forEach(token =>{
                context.global(token).emit('changeUsers', usersStore);

            });
            usersStore = null;
        }
        return true;
    }

    let isCommand = false, dataId;
    if(name === 'command'){
        name = data.query;
        dataId = data.id;
        data = data.data;
        isCommand = true;
    }


    let [controllerName, methodName] = name.split('.');
    controllerName = controllerName+'Controller';

    const controller = controllers[controllerName];

    if(!controller){
        return context.error('Not found controller: ' + controllerName);
    }
    if(!controller[methodName]){
        return context.error('Not found method: ' + name);
    }

    const response = controller[methodName](context, data);
    if(isCommand){
        context.emit('command', {id: dataId, data: response});
    }
    return true;
}
