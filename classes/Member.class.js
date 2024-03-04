class Member {
	constructor(knex) {
		this.knex = knex;
		this.tableName = 'member';
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
			const result = await this.knex(this.tableName).where(whereAttr).count('id as count');
			return result[0].count;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	//
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
				const result = await this.update(whereAttr, data);
				return result;
			}
			const result = await this.create({ ...whereAttr, ...data });
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async updateBy(whereAttr, data) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).update(data);
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
			const results = await query.limit(limit);
			return results;
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

	async delete(id) {
		try {
			const result = await this.knex(this.tableName).where({ id }).del();
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

module.exports = Member;