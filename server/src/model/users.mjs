import {createSchema} from '../db.js';
export default function ModelUsers(){
    return createSchema({
        table: 'users',
        columns: {
            id: []
        }
    })
}
