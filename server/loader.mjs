import mainController from './controllers/main.mjs'
import systemController from './controllers/system.mjs'
import accountController from './controllers/account.mjs'

const controllers = { mainController, systemController, accountController },
  controllerList = Object.values(controllers)

export const controllersInit = context => {
  for (const controller of controllerList) {
    if (controller.init) {
      controller.init(context)
    }
  }
}

function runController (context, controllerName, methodName, data = {}) {
  controllerName += 'Controller'

  const controller = controllers[controllerName]

  if (!controller) {
    return context.error('Not found controller: ' + controllerName)
  }
  if (!controller[methodName]) {
    return context.error('Not found method: ' + name)
  }
  return controller[methodName](context, data)
}

export const controllersOn = async (context, message) => {
  let { name, data } = JSON.parse(message)
  if (!name || !name.length) return this

  context.config.isLog && context.notice(data)

  if (name === 'set') {
    context.store = Object.assign(context.store, data)
    return true
  }

  if (name === 'req') {
    const [query, params, values] = data
    const [controllerName, methodName] = query.split('.')
    const response = await runController(context, controllerName, methodName, values);
    return context.emit('req', { id: params.id, data: response })
  }

}
