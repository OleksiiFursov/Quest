import mysql from "mysql2/promise.js";
import config from './config.mjs';

const db = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
})

class QueryBuilder {
  constructor () {
    this.selectColumns = []
    this.fromTable = null
    this.whereConditions = []
    this.type = ''
  }

  select (...columns) {
    this.selectColumns = columns
    return this
  }

  from (table) {
    this.fromTable = table
    return this
  }

  where (conditions) {
    this.whereConditions = conditions
    return this
  }

  build () {
    if (!this.type) {
      throw new Error('Query is not type. ' + JSON.stringify(this))
    }
    const selectClause = this.selectColumns.length > 0 ? `SELECT ${this.selectColumns.join(', ')}` : 'SELECT *'
    const fromClause = this.fromTable ? `FROM \`${this.fromTable}\`` : ''
    const whereClause = this.whereConditions.length > 0
      ? `WHERE ${this.whereConditions.map(([column, value, operator]) =>
        `\`${column}\` ${operator} ?`).join(' AND ')}`
      : ''

    return `${selectClause} ${fromClause} ${whereClause}`
  }

  execute (connection, callback) {
    const queryString = this.build()
    const values = this.whereConditions.map(condition => condition[1])

    connection.query(queryString, values, (err, results) => {
      callback(err, results)
    })
  }
}

export default {
  db,
  build: () => new QueryBuilder(),
}
