import configLocal from './config.local.mjs'
import {merge} from './tools.mjs'

export default merge({
    isDev: true,
    isLog: true,
    port: 9999,
    isSSL: false,
    db: {
        host: '31.131.24.159',
        username: 'crossfox_photoQuest_root',
        password: '5Jc0gpYa&i',
        name:  'crossfox_photoQuest'
    }

}, configLocal)
