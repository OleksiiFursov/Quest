export default {
    wss: {
        host: 'ws://localhost:9999',
        type: 'msgpack' // msgpack|json
    },
    router: {
        noAuth: 'account/login'
    },
    notification: {
        limit: 7
    },
    captcha: {
        key: "6LeogkwpAAAAAGvvlliEp-AoiEJTvtGBFonDu-Jk"
    },
    lang: 'en'
}
