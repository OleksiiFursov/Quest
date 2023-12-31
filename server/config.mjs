import configLocal from './config.local.mjs'
import {merge} from './tools.mjs'

export default merge({
    isDev: true,
    isLog: false,
    port: 9999,
    isSSL: false,
    jwt: {
        secretKey: 'ILoveCamelCase',
        expires: 12 * 60 * 60
    },
    db: {
        host: '31.131.24.159',
        user: 'crossfox_photoQuest_root',
        password: '5Jc0gpYa&i',
        name: 'crossfox_photoQuest'
    }

}, configLocal)
