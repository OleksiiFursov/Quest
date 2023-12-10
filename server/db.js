import mysql from "mysql2/promise";
import config from './config.mjs'

const db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name
});
