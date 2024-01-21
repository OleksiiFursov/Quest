import {username, password, birthday, email, gender, password2} from '../items.js'

export default {
    username: {
        ...username,
        afterCheck: 'accountCreate_username'
    }, password, password2, birthday, email, gender,
}

