const Helper = require("./Helper.class");
const Member = require("./Member.class");
const PromiseYear = require("./PromiseYear.class");
const Village = require("./Village.class");
const moment = require("moment");
class PromiseDocument {
	constructor(knex) {
		this.knex = knex;
		this.tableName = 'promise_document';
	}

	async getAll(limit = 100, sort = '', sortBy = 'asc') {
		try {
			const query = this.knex(this.tableName).select('*')
			if (sort) {
				query.orderBy(sort, sortBy);
			}
			const member = new Member(this.knex)
			const results = await query.limit(limit);
			const fining = results.map(async (result) => {
				return {
					...result,
					loaner: await member.getFirstBy({ citizen_id: result.citizen_id }),
					witness1: await member.getFirstBy({ citizen_id: result.witness1_citizen_id }),
					witness2: await member.getFirstBy({ citizen_id: result.witness2_citizen_id }),
					manager: await member.getFirstBy({ citizen_id: result.manager_citizen_id }),
					employee: await member.getFirstBy({ citizen_id: result.employee_citizen_id }),
				}
			})
			return await Promise.all(fining)
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

	async count(whereAttr, betweenDate = { start: null, end: null }) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).count('id as count');
			if (betweenDate.start && betweenDate.end) {
				const result = await this.knex(this.tableName).where(whereAttr).whereBetween('datetime', [moment(betweenDate.start).toDate(), moment(betweenDate.end).toDate()]).count('id as count');
				return result[0].count || 0;
			}
			return result[0].count || 0;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async sum(whereAttr, betweenDate = { start: null, end: null }, field) {
		try {
			const result = await this.knex(this.tableName).where(whereAttr).sum(`${field} as sum`);
			if (betweenDate?.start && betweenDate?.end) {
				const result = await this.knex(this.tableName).where(whereAttr).whereBetween('datetime', [moment(betweenDate.start).toDate(), moment(betweenDate.end).toDate()]).sum(`${field} as sum`);
				return result[0].sum || 0;
			}
			return result[0].sum || 0;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async checkQuota(citizen_id) {
		try {
			const result = await this.knex(this.tableName)
				.where({ witness1_citizen_id: citizen_id, status: 1 })
				.orWhere({ witness2_citizen_id: citizen_id, status: 1 }).countDistinct('group_id as count');
			console.log(result)
			const count = result[0].count;
			const limit = 3;
			if (count >= limit) {
				throw new Error('คุณได้ค้ำประกันไปแล้ว 3 ครั้ง');
			}
			return limit - count;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async checkPromiseActiveQuota(citizen_id) {
		try {
			const result = await this.count({ citizen_id, status: 1 });
			if (result > 0) {
				throw new Error('คุณมีสัญญากู้ที่ยังไม่สิ้นสุด กรุณาตรวจสอบ');
			}
			return true;
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

	async cancelPromiseDocument(groupId) {
		try {
			const response = await this.update({ group_id: groupId }, { status: -1 })
			return response
		} catch (error) {
			throw error;
		}
	}
	async endPromiseDocument(groupId) {
		try {
			const response = await this.update({ group_id: groupId }, { status: 2 })
			return response
		} catch (error) {
			throw error;
		}
	}
	async acceptPromiseDocument(groupId) {
		try {
			const checkDistince = await this.getFirstBy({ group_id: groupId });
			if (!(checkDistince.manager_citizen_id && checkDistince.employee_citizen_id)) {
				throw new Error('ข้อมูลบางอย่างไม่ครบถ้วน โปรดตรวจสอบ');
			}
			if (checkDistince.status !== 0) {
				throw new Error('สัญญากู้นี้ได้รับการยืนยันแล้ว');
			}
			if (checkDistince.guarantee_type === "guarantor") {
				if (!(checkDistince.witness1_citizen_id && checkDistince.witness2_citizen_id)) {
					throw new Error('ข้อมูลผู้ค้ำประกันไม่ครบถ้วน โปรดตรวจสอบ');
				}
			}
			const response = await this.update({ group_id: groupId }, { status: 1 })
			return response
		} catch (error) {
			throw error;
		}
	}
	async updatePromiseDocumentCitizenCard(groupId, { witness1_citizen_id, witness2_citizen_id, employee_citizen_id, manager_citizen_id }) {
		try {
			const checkGroup = await this.getFirstBy({ group_id: groupId });
			if (!checkGroup) {
				throw new Error('ไม่พบข้อมูลกลุ่มนี้ในระบบ');
			}
			const response = await this.update({ group_id: groupId }, { witness1_citizen_id, witness2_citizen_id, employee_citizen_id, manager_citizen_id })
			return response
		} catch (error) {
			throw error;
		}
	}

	async getBy(whereAttr, limit = 100, sort = '', sortBy = 'asc', select, betweenDate) {
		try {
			const query = this.knex(this.tableName).where(whereAttr);
			query.select('promise_document.*', 'member.title_name', 'member.first_name', 'member.last_name', 'member.citizen_id as member_citizen_id')
			query.leftJoin('member', 'promise_document.citizen_id', 'member.citizen_id')
			if (betweenDate.start && betweenDate.end) {
				query.whereBetween('promise_document.datetime', [moment(betweenDate.start).toDate(), moment(betweenDate.end).toDate()]);
			}
			if (sort) {
				query.orderBy(sort, sortBy);
			}
			if (select) {
				query.select(select);
			}
			const results = await query.limit(limit);
			const member = new Member(this.knex)
			const village = new Village(this.knex)
			const fining = results.map(async (result) => {
				return {
					...result,
					loaner: await member.getFirstBy({ citizen_id: result.citizen_id }),
					witness1: await member.getFirstBy({ citizen_id: result.witness1_citizen_id }),
					witness2: await member.getFirstBy({ citizen_id: result.witness2_citizen_id }),
					manager: await member.getFirstBy({ citizen_id: result.manager_citizen_id }),
					employee: await member.getFirstBy({ citizen_id: result.employee_citizen_id }),
					village:  await village.getFirstBy({ id: result.village_id }),
				}
			})
			return await Promise.all(fining)
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async getFirstBy(whereAttr) {
		try {
			const query = this.knex(this.tableName).where(whereAttr)
			const member = new Member(this.knex)
			const result = await query.first();
			const fining = {
				...result,
				loaner: await member.getFirstBy({ citizen_id: result.citizen_id }),
				witness1: await member.getFirstBy({ citizen_id: result.witness1_citizen_id }),
				witness2: await member.getFirstBy({ citizen_id: result.witness2_citizen_id }),
				manager: await member.getFirstBy({ citizen_id: result.manager_citizen_id }),
				employee: await member.getFirstBy({ citizen_id: result.employee_citizen_id }),
			}
			return fining
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	async groupPromise(village_code, { promiseList, promiseData }) {
		try {
			const groupId = Helper.randomString(10)
			const newPromiseForm = promiseList.map(async (promise) => {
				return await this.create({
					...promiseData,
					interest: promise.interest,
					type: promise.type,
					hedge_fund: promise.hedge_fund,
					group_id: groupId,
					amount: promise.value,
					village_code: village_code,
				})
			})
			return await Promise.all(newPromiseForm)
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
			console.log(data)
			// check value
			if (!data.citizen_id) throw new Error('กรุณายืนยันหมายเลขบัตรประชาชน');

			const member = new Member(this.knex)
			const checkCitizen = await member.getFirstBy({ citizen_id: data.citizen_id });
			if (!checkCitizen) throw new Error('ไม่พบข้อมูลหมายเลขบัตรนี้ในระบบ');
			if (data.witness1_citizen_id) {
				const witness1CitizenIdCheck = await member.getFirstBy({ citizen_id: data.witness1_citizen_id });
				if (!witness1CitizenIdCheck) throw new Error('ไม่พบข้อมูลหมายเลขบัตรผู้ค้ำประกันคนที่ 1 ในระบบ');
			}
			if (data.witness2_citizen_id) {
				const witness2CitizenIdCheck = await member.getFirstBy({ citizen_id: data.witness2_citizen_id });
				if (!witness2CitizenIdCheck) throw new Error('ไม่พบข้อมูลหมายเลขบัตรผู้ค้ำประกันคนที่ 2 ในระบบ');
			}

			const village = new Village(this.knex);
			const checkVillage = await village.getFirstBy({ code: data.village_code }, true);
			const checkLastPromise = await this.getBy({ village_id: checkVillage.id }, 1, 'running_number', 'desc', ['running_number'], {});
			const runningNumber = checkLastPromise?.[0]?.running_number ? checkLastPromise[0].running_number + 1 : 1;
			const promiseYear = new PromiseYear(this.knex);
			const checkPromiseYear = await promiseYear.getFirstBy({ village_id: checkVillage.id });
			const dataForm = {
				citizen_id: data.citizen_id,
				running_number: runningNumber,
				promise_year: checkPromiseYear.year,
				datetime: moment().toDate(),
				village_id: checkVillage.id,
				reason: data.reason || '',
				amount: data.amount,
				hedge_fund: data.hedge_fund,
				deposit_amount: data.deposit_amount,
				start_date: moment(data.start_date).toDate(),
				expired_date: moment(data.expired_date).toDate(),
				interest: data.interest,
				manager_citizen_id: data.manager_citizen_id,
				employee_citizen_id: data.employee_citizen_id,
				witness1_citizen_id: data.witness1_citizen_id,
				witness2_citizen_id: data.witness2_citizen_id,
				witness3_citizen_id: data.witness3_citizen_id,
				status: data.status,
				group_id: data.group_id,
				maximum_loan: data.maximum_loan,
				multiple_deposit: data.multiple_deposit,
				period: data.period,
				age: data.age,
				type: data.type,
				guarantee_type: data.guarantee_type,
				guarantee_value: data.guarantee_value,
			}
			const result = await this.knex(this.tableName).insert(dataForm);
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
			const result = await this.knex(this.tableName).where(whereAttr).update(data);
			return result;
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

module.exports = PromiseDocument;