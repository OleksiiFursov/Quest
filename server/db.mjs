import mysql from 'mysql2/promise.js'
import config from './config.mjs'

const db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
})


const operatorAlias = {
    NIN: 'NOT IN',
    NLIKE: 'NOT LIKE',
    NNULL: 'NOT NULL',
}

class QueryBuilder {
    constructor() {
        this.column = []
        this._where = []
        this.type = null
        this.table = null
        this._limit = null;
        this._offset = null;
        this._order = [];
    }

    #err(msg) {
        throw new Error(msg + JSON.stringify(this))
    }


    select(...columns) {
        this.column = columns
        this.type = 'select'
        return this
    }

    from(table) {
        this.table = table
        return this
    }

    limit(value, offset) {
        this._limit = value;
        if (offset) {
            this._offset = offset;
        }
        return this;
    }

    order(field, direction = 'DESC') {
        this._order.push(field, direction);
        return this;
    }

    whereOr(conditions) {
        return this._where(conditions, 'OR')
    }

    where(conditions, operatorLeft = 'AND') {
        if (typeof conditions === 'number') {
            conditions = {id: conditions}
        }

        this._where.push([conditions, operatorLeft])

        return this
    }

    generateWhere() {
        let res = ''
        for (const [conditions, operatorJoin] of this._where) {
            res += (res ? ' ' + operatorJoin : '') + this.generateWhereItem(conditions)
        }
        return res
    }

    #addQuoteIfNeeded(value) {
        return typeof value === 'string' ? '\'' + value + '\'' : value
    }

    generateWhereItem(conditions, operatorJoin = 'AND') {
        let res = ''
        for (const key in conditions) {
            if (key === 'and' || key === 'or') {
                res += ' ' + operatorJoin + ' ' + conditions[key].map(v => '(' + this.generateWhereItem(v) + ')').join(' ' + key.toUpperCase()+' ');
                continue;
            }
            let value = conditions[key]
            let operator = '='
            if (typeof value === 'object') {

                if (value === null) {
                    operator = 'IS NULL'
                    value = '';
                } else {
                    const keys = Object.keys(value);

                    operator = keys[0] !== '0' ? keys[0].toUpperCase() : null;
                    if (operatorAlias[operator])
                        operator = operatorAlias[operator]

                    if (Array.isArray(value) || operator === 'IN' || operator === 'NOT IN') {
                        operator = operator || 'IN';
                        value = '(' + value.map(cur => this.#addQuoteIfNeeded(cur)).join(', ') + ')'
                    } else if (operator === 'LIKE' || operator=== 'NOT LIKE') {
                        value = '"%' + value[keys[0]] + '%"';
                    } else if (value instanceof RegExp) {
                        value = value.toString().slice(-1, 1);
                    } else if (['!=', '<>', '>', '<', '>=', '<='].includes(keys[0])) {
                        res += '('+ keys.map(_key=> key + _key + value[_key]).join( ' ' + operatorJoin + ' ') + ')';
                        continue;
                    }
                }


            } else {
                value = this.#addQuoteIfNeeded(value);
            }
            res += (res.length ? ' ' + operatorJoin + ' ' : '') + key + ' ' + operator + ' ' + value

        }

        return res
    }


    #runLimit() {
        return (this._limit || this._offset ? ' LIMIT ' + (this._offset || 0) + ',' + (this._limit || Number.MAX_SAFE_INTEGER) : '');
    }

    #runOrder() {
        if (!this._order.length) {
            return '';
        }
        let res = 'ORDER BY';
        for (const order of this._order) {
            res += " " + order.join(' ');
        }
        return res;

    }

    run() {
        if (!this.type) {
            this.#err('Query is not type');
        }
        if (!this.table) {
            this.#err('Query is not table');
        }

        if (this.type === 'select') {

            return (
                'SELECT ' + (this.column.length ? this.column.join(', ') : '*') +
                ' FROM ' + this.table +
                ' WHERE ' + this.generateWhere() +
                this.#runOrder() +
                this.#runLimit()


            )
        }
    }

    execute(connection, callback) {
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
    date_created: null,
    or: [
        {
            age: {
                '<': 12,
                '>': 18,
            },
            or: [
                {
                    name: {LIKE: 'test'},
                },
                {
                    name: {LIKE: 'test2'},
                },
            ],
        },
        {
            gg: {'NLIKE': 'testgg'}
        }
    ],
}).run())


const build = () => new QueryBuilder();

const createSchema = params => {
    const q = this.build().from(params.table)
    return {
        find(where, columns = "*", run = 1) {
            return q.select(columns).where(where).run(run)
        },
        findOne(where, columns = "*", run = 1) {
            const res = q.select(columns).where(where).limit(1).run(run);
            if (res && res[0]) {
                return res[0];
            }
        },
        select(columns = '*') {
            return q.select(columns)
        }
    }
}


export {db, build, createSchema};

export default {
    db, build, createSchema
}