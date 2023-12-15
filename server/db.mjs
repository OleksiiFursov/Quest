import mysql from 'mysql2/promise.js'
import config from './config.mjs'

const db = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
})

const operators = ['LIKE', 'NOT LIKE', '=', '!=', '<>', '>', '<', '>=', '<=', 'REGEXP', 'NOT REGEXP', 'IN', 'NOT IN', 'BETWEEN', 'NOT BETWEEN', 'IS NULL', 'IS NOT NULL', 'IS', 'MATCH']

class QueryBuilder {
  constructor () {
    this.column = []
    this.fromTable = null
    this._where = []
    this.type = ''
    this.table = ''
  }

  select (...columns) {
    this.column = columns
    this.type = 'select'
    return this
  }

  from (table) {
    this.table = table
    return this
  }

  whereOr (conditions) {
    return this._where(conditions, 'OR')
  }

  where (conditions, operatorLeft = 'AND') {
    if (typeof conditions === 'number') {
      conditions = { id: conditions }
    }

    this._where.push([conditions, operatorLeft])

    return this
  }

  generateWhere () {
    let res = ''
    for (const [conditions, operatorJoin] of this._where) {
      res += (res ? ' ' + operatorJoin : '') + this.generateWhereItem(conditions)
    }
    return res
  }

  #addQuoteIfNeeded (value) {
    return typeof value === 'string' ? '\'' + value + '\'' : value
  }

  generateWhereItem (conditions, operatorJoin = 'AND') {
    let res = ''
    for (const key in conditions) {
      if (key === 'and' || key === 'or') {
        res += '(' + conditions[key].map(v => this.generateWhereItem(v) + ' '+ key + ' ') + ')'
      } else if (operators.includes(key)) {
        console.log(11);
      } else {
        let value = conditions[key]
        let operator = ' = '
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            operator = ' IN '
            value = '(' + value.map(cur => this.#addQuoteIfNeeded(cur)).join(', ') + ')'
          }
        }
        res += (res.length ? ' ' + operatorJoin : '') + ' ' + key + operator + value
      }
    }

    return res
  }

  run () {
    if (!this.type) {
      throw new Error('Query is not type. ' + JSON.stringify(this))
    }
    if (!this.table) {
      throw new Error('Query is not from. ' + JSON.stringify(this))
    }

    if (this.type === 'select') {

      return (
        'SELECT ' + (this.column.length ? this.column.join(', ') : '*') +
        ' FROM ' + this.table +
        ' WHERE' + this.generateWhere()

      )
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

console.log(new QueryBuilder().select('name', 'age').from('users').where({
  age: 12,
  colors: ['red', 'green', 'blue'],
  or: [
    {
      age: {
        '<': 12,
        '>': 18,
      },
      and: [
        {
          name: { LIKE: 'test' },
          search: 'hh',
        },
      ],
    },
  ],
}).run())
export default {
  db,
  build: () => new QueryBuilder(),
}
