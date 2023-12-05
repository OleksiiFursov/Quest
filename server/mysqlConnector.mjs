import mysql from "mysql";
import config from "./config.mjs";



export default function mysqlConnector(context, users, delay) {
    const connect = mysql.createConnection(config.db);

    connect.connect(err => {
        if (err) {
            const _delay = Math.min(3000, delay+250);
            setTimeout(() => mysqlConnector(context, users, _delay), _delay);
            return console.log('\x1b[31m', 'MySQL ERROR: ' + err.message, '\x1b[0m');
        }

        console.log('\x1b[32m', 'MySQL - connected', '\x1b[0m');
        context().log('MySQL - connected', 'success');

    });
    connect.on('error' , err => {
        context().log(err);
        const _delay = Math.min(3000, delay+250);
        setTimeout(mysqlConnector.bind(null, ...arguments), _delay);
    });

    return connect;
}
