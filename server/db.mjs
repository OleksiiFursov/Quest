import mysql from "mysql2/promise.js";
import config from './config.mjs';

const db = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
})

const operator = ["LIKE", "NOT LIKE", "=", "!=", '<>', '>', '<', '>=', '<=', "REGEXP", "NOT REGEXP", 'IN', "NOT IN", "BETWEEN", "NOT BETWEEN", "IS NULL", "IS NOT NULL", "IS", 'MATCH'];

class QueryBuilder {
    constructor() {
        this.column = []
        this.fromTable = null
        this._where = []
        this.type = ''
    }

    select(...columns) {
        this.column = columns
        this.type = 'select';
        return this
    }

    from(table) {
        this.table = table
        return this
    }

    whereOr(conditions) {
        return this._where(conditions, 'OR');
    }

    where(conditions, operatorLeft = 'AND') {
        if (typeof conditions === 'number') {
            conditions = {id: conditions};
        }

        this._where.push([conditions, operatorLeft]);

        return this
    }

    generateWhere() {
        let res = '';
        for (const [conditions, operatorJoin] of this._where) {
            res += (res ? ' ' + operatorJoin : '') + this.generateWhereItem(conditions);
        }
        return res;
    }

    generateWhereItem(conditions, isNested = false) {
        if (!conditions) {
            return '';
        }

        const conditionClauses = [];

        for (const key in conditions) {
            if (key === 'or' || key === 'and') {
                const subClauses = conditions[key].map( (subCondition) => {
                    return this.generateWhereItem(subCondition, key === 'or');
                });
                conditionClauses.push(`(${subClauses.join(` ${key.toUpperCase()} `)})`);
            } else if (key === 'like' || key === '<' || key === '>' || key === 'in') {
                const operator = key.toUpperCase();
                const value = conditions[key];
                if (key === 'in' && Array.isArray(value)) {
                    const inValues = value.map(v => `'${v}'`).join(', ');
                    conditionClauses.push(`(${inValues})`);
                } else if (key === 'like' && typeof value === 'string') {
                    conditionClauses.push(`${key} LIKE '%${value}%'`);
                } else {
                    conditionClauses.push(`${key} ${operator} '${value}'`);
                }
            } else {
                const conditionValue = conditions[key];
                if (Array.isArray(conditionValue)) {
                    const inValues = conditionValue.map(v => `'${v}'`).join(', ');
                    conditionClauses.push(`${key} IN (${inValues})`);
                } else if (typeof conditionValue === 'object') {
                    const subConditions = Object.entries(conditionValue).map(([subKey, subValue]) => `${subKey} = '${subValue}'`);
                    conditionClauses.push(`(${subConditions.join(' AND ')})`);
                } else {
                    conditionClauses.push(`${key} = '${conditionValue}'`);
                }
            }
        }

        if (isNested) {
            return conditionClauses.join(` ${isNested === true ? 'AND' : isNested.toUpperCase()} `);
        } else {
            return conditionClauses.join(' AND ');
        }
    }

    run() {
        if (!this.type) {
            throw new Error('Query is not type. ' + JSON.stringify(this))
        }
        if (!this.type) {
            throw new Error('Query is not type. ' + JSON.stringify(this))
        }

        if (this.type === 'select') {

            return (
                'SELECT ' + (this.column.length ? this.column.join(', ') : '*') +
                ' FROM ' + this.table +
                ' WHERE ' + this.generateWhere()

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
    or: [
        {
            age: {
                '<': 12,
                '>': 18
            },
            and: [
                {
                    name: {like: 'test'},
                    search: 'hh'
                }
            ]
        }
    ]
}).run())
export default {
    db,
    build: () => new QueryBuilder(),
}
