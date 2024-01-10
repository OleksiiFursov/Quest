import configLocal from '#config.local.mjs'
import {merge} from '#tools.mjs'

export default merge({
    isDev: true,
    isLog: false,
    port: 9999,
    isSSL: false,
    login: {
        token: {
            length: 64,
            expires: 60*60*24,
            restore: 60*60*24*30
        },
        attempt: {
            duration: 900,
            limit: 5,
            enableCaptcha: 3
        }
    },
    db: {
        host: '31.131.24.159',
        user: 'crossfox_photoQuest_root',
        password: '5Jc0gpYa&i',
        name: 'crossfox_photoQuest'
    }

}, configLocal)
