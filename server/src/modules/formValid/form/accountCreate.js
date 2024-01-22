import {username, password, birthday, email, gender, password2} from '../items.js'

export default {
    username: {
        ...username,
        afterCheck: ['accountCreate_username', `User is exist. Please <a onclick='goTo("account/login")'>Login</a>`]
    }, password, password2, birthday, email, gender,
}

