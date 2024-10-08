class Permission {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'permission'; 
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
      const result = await this.knex(this.tableName).where(whereAttr).count("id as count");
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
        const result = await this.update({ id: checkData.id }, data);
        return result;
      }
      const result = await this.create({ ...data, ...whereAttr });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getBy(whereAttr, limit = 100, offset = 0, sort = '', sortBy = 'asc') {
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

 async getFirstBy(whereAttr, isError) {
    try {
      const result = await this.knex(this.tableName).where(whereAttr).first();
      if (isError && !result) {
        throw new Error(`${this.tableName}, Data not found`);
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

 async getBetween(fields = ["created_at"], values = [[]], limit = 100, sort = '', sortBy = 'asc') {
    try {
      const query = this.knex(this.tableName).select('*');
      fields.forEach((field, index) => {
        query.whereBetween(field, values[index]);
      });
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

  async update(whereAttr, data) {
    try {
      await this.getFirstBy(whereAttr, true);
      const result = await this.knex(this.tableName).where(whereAttr).update(data);
      return this.getFirstBy(whereAttr);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(whereAttr) {
    try {
      await this.getFirstBy(whereAttr, true);
      const result = await this.knex(this.tableName).where(whereAttr).del();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = Permission;