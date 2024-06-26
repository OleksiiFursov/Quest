import mysql from 'mysql2/promise.js'
import config from './config.js'

const db = mysql.createPool({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.name,
});


const operatorAlias = {
	NIN: 'NOT IN',
	NLIKE: 'NOT LIKE',
	NNULL: 'NOT NULL',
}
//const valueExclude = ['now()', '']

const historySQL = []

class QueryBuilder {
	constructor () {
		this._from = null
		this.type = null
		this.escape = true
		this.safe = false
		this.safeWhere = []
		this._asArray = false
		this._where = []
		this._column = []
		this._limit = null
		this._offset = null
		this._order = []
		this._groupBy = []
		this._data = []
		this._join = []
	}

	#err (msg) {
		throw new Error(msg + JSON.stringify(this))
	}

	asArray (status = true) {
		this._asArray = status
		return this
	}

	getLast () {
		return historySQL.at(-1) || null
	}

	getHistory () {
		return historySQL
	}

	select (...columns) {
		this._column = columns
		this.type = 'select'
		return this
	}

	delete () {
		this.type = 'delete'
		return this
	}

	update (data) {
		this.type = 'update'
		this._data = data
		return this
	}

	insert (data) {
		this.type = 'insert'
		if (!data[0]) {
			data = [data]
		}
		this._data = data
		return this
	}

	from (table) {
		this._from = table
		return this
	}

	limit (value, offset) {
		this._limit = value
		if (offset) {
			this._offset = offset
		}
		return this
	}

	order (field, direction = 'DESC') {
		this._order.push(field, direction)
		return this
	}

	groupBy (column) {
		this._groupBy.push(column)
		return this
	}

	where (conditions, operatorLeft = 'AND') {
		if (typeof conditions === 'number') {
			conditions = { id: conditions }
		}

		this._where.push([conditions, operatorLeft])

		return this
	}

	#runWhere () {
		let res = ''
		for (const [conditions, operatorJoin] of this._where) {
			res += (res ? ' ' + operatorJoin : '') + this.generateWhereItem(conditions)
		}
		return ' WHERE ' + res
	}

	leftJoin (table, ...on) {
		return this.#join('LEFT', table, on)
	}

	rightJoin (table, ...on) {
		return this.#join('RIGHT', table, on)
	}

	innerJoin (table, ...on) {
		return this.#join('INNER', table, on)
	}

	fullJoin (table, ...on) {
		return this.#join('FULL', table, on)
	}

	#join (type, table, on) {
		this._join.push(type + ' JOIN ' + table + ' ON ' + on.map(v => v.join('=')).join(' '))
		return this
	}

	#addQuoteIfNeeded (value) {
		if (value && value[0] === '`' && value[1] === '`' || !this.escape) {
			return value.slice(2);
		}
		return  db.escape(value)

		//return value //typeof value === 'string' ? '\'' + value + '\'' : value
	}

	generateWhereItem (conditions, operatorJoin = 'AND') {
		let res = ''
		for (const key in conditions) {
			if (key === 'and' || key === 'or') {
				const lastChar = res.at(-1);
				res += (lastChar === undefined || lastChar === ' ' ? '' : ' ' + operatorJoin + ' ') + conditions[key].map(v => '(' + this.generateWhereItem(v) + ')').join(' ' + key.toUpperCase() + ' ')
				continue
			}
			let value = conditions[key]
			let operator = '='
			if (typeof value === 'object') {

				if (value === null) {
					operator = 'IS NULL'
					value = ''
				} else {
					const keys = Object.keys(value)

					if (keys.length && keys[0] !== '0') {
						const _key = keys[0].toUpperCase()
						operator = operatorAlias[_key] || _key
					}

					if (Array.isArray(value) || operator === 'IN' || operator === 'NOT IN') {
						operator = operator || 'IN'
						value = '(' + value.map(cur => this.#addQuoteIfNeeded(cur)).join(', ') + ')'
					} else if (operator === 'LIKE' || operator === 'NOT LIKE') {
						value = '"%' + value[operator] + '%"'
					} else if (value instanceof RegExp) {
						value = this.#addQuoteIfNeeded(value.toString().slice(1, -1))
						operator = 'REGEXP'
					} else if (['!=', '<>', '>', '<', '>=', '<='].includes(keys[0])) {
						res += (res.length ? ' '+operatorJoin+' ':'') + '(' + keys.map(_key => {
							let val
							if (this.safe) {
								val = '?'
								this.safeWhere.push(value[_key])
							} else {
								val = this.#addQuoteIfNeeded(value[_key])
							}

							return key + _key + val
						}).join(' ' + operatorJoin + ' ') + ')'
						continue
					}
				}

			} else {
				value = this.#addQuoteIfNeeded(value)
			}

			if (this.safe && value) {
				this.safeWhere.push(value)
				value = '?'
			}
			res += (res.length ? ' ' + operatorJoin + ' ' : '') + key + ' ' + operator + ' ' + value

		}

		return res
	}

	#runLimit () {
		return (this._limit || this._offset ? ' LIMIT ' + (this._offset || 0) + ',' + (this._limit || Number.MAX_SAFE_INTEGER) : '')
	}

	#runGroupBy () {
		return this._groupBy.length ? ' GROUP BY ' + (this._groupBy.join(', ')) : ''
	}

	#runOrder () {
		if (!this._order.length) {
			return ''
		}
		let res = 'ORDER BY'
		for (const order of this._order) {
			res += ' ' + order.join(' ')
		}
		return res

	}

	#runJoin () {
		return this._join.length ? this._join.join('') : ''
	}

	#runDataUpdate () {
		return ' SET ' + Object.entries(this._data).map(([column, value]) => column + '=' + this.#addQuoteIfNeeded(value)).join(', ')
	}

	#runDataInsert () {
		return ' (' + Object.keys(this._data[0]).join(', ') + ') VALUES ' + this._data.map(v => '(' + Object.values(v).map(v => this.#addQuoteIfNeeded(v)) + ')')
	}

	async #runQuery (sql) {
		historySQL.push(sql)
		let err = null
		return [
			await db.execute(sql).catch(v => {err = v}),
			err,
		]
	}

	async #runTypeSelect () {
		const sql = (
		  'SELECT ' + (this._column.length ? this._column.join(', ') : '*') +
		  ' FROM ' + this._from +
		  this.#runJoin() +
		  this.#runWhere() +
		  this.#runGroupBy() +
		  this.#runOrder() +
		  this.#runLimit()
		)
		const [data, err] = await this.#runQuery(this._asArray ? {
			sql,
			rowsAsArray: true,
		} : sql)

		if(err){
			console.error( [sql, err])
		}
		return [
			data ? data[0] : null,
			err ? [sql, err] : err,
			data ? data[1] : null,
		]
	}

	async #runTypeUpdate () {
		if (!Object.keys(this._data).length) return this.#err('Query is not data')

		const sql = `UPDATE ${this._from}${this.#runDataUpdate()}${this.#runWhere()}${this.#runLimit()}`

		const [data, err] = await this.#runQuery(sql)
		return [
			data ? data[0] : null,
			err ? [sql, err] : err,
		]
	}

	async #runTypeInsert () {
		const sql = `INSERT INTO ${this._from}${this.#runDataInsert()}`
		const [data, err] = await this.#runQuery(sql)
		return [
			data ? data[0] : null,
			err ? [sql, err] : err,
		]
	}

	async #runTypeDelete () {
		if (!this._where.length) {
			return this.#err('SAFE-STOP: Query in not exists WHERE')
		}
		const sql = `DELETE
                     FROM ${this._from} ${this.#runWhere()}${this.#runLimit()}`

		const [data, err] = await this.#runQuery(sql)
		return [
			data ? data[0] : null,
			err ? [sql, err] : err,
		]
	}

	async run () {
		if (!this.type) return this.#err('Query is not type')
		if (!this._from) return this.#err('Query is not table')

		if (this.type === 'select') return this.#runTypeSelect()
		if (this.type === 'update') return this.#runTypeUpdate()
		if (this.type === 'insert') return this.#runTypeInsert()
		if (this.type === 'delete') return this.#runTypeDelete()

	}
}

const build = () => {
	try {
		return new QueryBuilder()
	} catch (err) {
		console.error('Error with SQL-build')
		return { select: () => {} }
	}
}

const createSchema = params => {
	const q = build().from(params.table)
	return {
		async has (where) {
			return await this.count(where) > 0
		},
		async find (where, columns = '*', run = 1) {
			return await q.select(columns).where(where).run(run)
		},
		async findOne (where, columns = ['*'], run = 1) {
			const [data] = await q.select(columns).where(where).limit(1).run(run)
			if (data && data[0]) {
				return data[0]
			} else {
				return null
			}
		},
		select (columns = '*') {
			return q.select(columns)
		},
		async count (where = {}, run = 1) {
			const res = await q.select('COUNT(*)').asArray().where(where).run(run);
			return res?.[0]?.[0]?.[0] ?? null
		},
		delete (where = {}, run = 1) {
			return q.delete().where(where).run(run)
		},
		update (data, where = {}, run = 1) {
			return q.update(data).where(where).run(run)
		},
		insert (data, where = {}, run = 1) {
			return q.insert(data).where(where).run(run)
		},
		async column (column, where, run = 1) {
			const res = await this.findOne(where, column, run)
			return res ? res[column] : null
		},

	}
}

let lastQuery = () => historySQL.at(-1);
global.lastQuery = lastQuery;
const dateNow = time => '``NOW()'+ (time > 0 ? '+':'')+ time;
export {build, createSchema, lastQuery, dateNow }


export default {
	db, build, createSchema, historySQL,
}
