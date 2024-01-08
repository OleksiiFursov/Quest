import {createSchema} from '../db.mjs';

export default createSchema({
    table: 'users_attempt',
    columns: {
        username: ['string'],
        ip: ['ip'],
        user_agent: ['string']
    }
})
