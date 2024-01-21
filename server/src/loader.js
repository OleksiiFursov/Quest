import mainController from './controllers/main.js'
import systemController from './controllers/system.js'
import accountController from './controllers/account.js'
import formValidController from "#controllers/formValid.js";
import Resp from './helpers/Resp.mjs'
import { error } from './tools.js'
import typeMessage from './helpers/typeMessage.js';

const controllers = { mainController, systemController, accountController, formValidController },
  controllerList = Object.values(controllers)

export const controllersInit = context => {
	for (const controller of controllerList) {
		if (controller.init) {
			controller.init(context)
		}
	}
}

async function runController (context, controllerName, methodName, data = {}) {
	controllerName += 'Controller'
	const controller = controllers[controllerName]

	if (!controller) {
		return context.error('Not found controller: ' + controllerName)
	}
	if (!controller[methodName]) {
		return context.error('Not found method: ' + methodName + ' in controller: ' + controllerName)
	}

	try {
		const result = await controller[methodName](context, data)
		if (typeof result === 'object') return result
		error('runController: ' + controllerName + '.' + methodName + ' - ' + JSON.stringify(result))
		return Resp.error('Error on the server. We are already aware of the problem and are working to fix it')
	} catch (error) {
		return context.error('Error in method ' + methodName + ': ' + error)
	}
}

export const controllersOn = async (context, message) => {
	const { name, data } = typeMessage.decode(message)
	if (!name) return this

	context.config.isLog && context.notice(data)

	if (name === 'set') {
		context.state = { ...context.state, ...data }
		return true
	}

	if (name === 'req') {
		const [query, params, values] = data
		const [controllerName, methodName] = query.split('/')
		const response = await runController(context, controllerName, methodName, values)
		return context.emit('req', { id: params.id, data: response })
	}

}
