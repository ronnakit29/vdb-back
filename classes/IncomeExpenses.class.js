const Member = require("./Member.class");

class IncomeExpenses {
	constructor(knex) {
		this.knex = knex;
		this.tableName = 'income_expenses'; 
	}

	async getAll(limit = 100, sort = '', sortBy = 'asc') {
		try {
			const query = this.knex(this.tableName).select('*');
			if (sort) {
				query.orderBy(sort, sortBy);
			}
			const results = await query.limit(limit);
			return results;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getById(id) {
		try {
			const result = await this.knex(this.tableName).where({ id }).first();
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async count(whereAttr) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).count();
			return result[0].count;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getOrCreate(whereAttr, data) {
		try {
			const checkData = await this.getFirstBy(whereAttr);
			if (checkData) {
				return checkData;
			}
			const result = await this.create(data);
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async createOrUpdate(whereAttr, data) {
		try {
			const checkData = await this.getFirstBy(whereAttr);
			if (checkData) {
				const result = await this.update(checkData.id, data);
				return result;
			}
			const result = await this.create({ ...data, ...whereAttr });
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getBy(whereAttr, limit = 100, sort = '', sortBy = 'asc') {
		try {
			const query = this.knex(this.tableName).where(whereAttr);
			if (sort) {
				query.orderBy(sort, sortBy);
			}
			const member = new Member(this.knex)
			const results = await query.limit(limit);
			const returnData = results.map(async (item) => {
				const manager = await member.getFirstBy({ citizen_id: item.manager_citizen_id })
				delete item.manager_citizen_id
				return {
					...item,
					manager_name: manager.title_name + manager.first_name + ' ' + manager.last_name
				}
			});
			return await Promise.all(returnData);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

 async getFirstBy(whereAttr) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).first();
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async create(data, isCheckDuplicate = false, field = {}) {
		try {
			if (isCheckDuplicate) {
				const checkDuplicate = await this.getFirstBy(field);
				if (checkDuplicate) {
					const fields = Object.keys(field).join(', ');
					throw new Error(`${fields} already exists`);
				}
			}
			const result = await this.knex(this.tableName).insert(data);
			return await this.getById(result[0]);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async increement(whereAttr, field, value) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).increment(field, value);
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async decrement(whereAttr, field, value) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).decrement(field, value);
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async update(id, data) {
		try {
			const result = await this.knex(this.tableName).where({ id }).update(data);
			return await this.getById(id);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async delete(whereAttr) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).del();
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

module.exports = IncomeExpenses;