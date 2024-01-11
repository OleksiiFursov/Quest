import {createSchema} from '../db.js';
export default createSchema({
    table: 'users_token',
    columns: {
        token: ['string'],
        user_id: ['number'],
        ip: ['ip'],
        user_agent: ['string'],
        date_expires: ['datetime']
    }
})
