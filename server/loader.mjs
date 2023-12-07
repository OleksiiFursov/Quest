import mainController from './controllers/main.mjs';
import systemController from './controllers/system.mjs';
import usersController from './controllers/users.mjs';


const controllers = {mainController, systemController, usersController},
    controllerList = Object.values(controllers);


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

        return true;
    }

    let isCommand = false, dataId;
    if(name === 'command'){
        name = data.query;
        dataId = data.id;
        data = data.data;
        isCommand = true;
    }
    if(name === 'req'){
       console.log(data);
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
