import configLocal from './config.local.mjs'
import {merge} from './tools.mjs'

export default merge({
    isDev: true,
    isLog: true,
    port: 9999,
    isSSL: false,

}, configLocal)
