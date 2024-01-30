import {password, birthday, email, gender, password2} from '../items.js'

export default {
    email: {
        ...email,
        afterCheck: ['accountCreate_email', `The email has been registered. Please <a onclick='goTo("account/login")'>Login</a>`]
    }, password, password2, birthday, gender,
}

