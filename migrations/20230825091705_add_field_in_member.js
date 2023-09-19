/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	// {
	// 	cid: '1578800002955',
	// 		thName: { prefix: 'นาย', firstname: 'รณกฤต', lastname: 'มูลวงค์' },
	// 	enName: { prefix: 'Mr.', firstname: 'Ronnakit', lastname: 'Moonwong' },
	// 	dob: { year: '2544', month: '08', day: '29' },
	// 	issueDate: { year: '2565', month: '12', day: '20' },
	// 	expireDate: { year: '2574', month: '08', day: '28' },
	// 	address: '179 หมู่ที่ 4    ตำบลท่าข้าวเปลือก อำเภอแม่จัน จังหวัดเชียงราย',
	// 		issuer: 'อำเภอดอยหลวง/เชียงราย'
	// }
	return knex.schema.alterTable('member', function (table) {
		table.string('en_title_name');
		table.string('en_first_name');
		table.string('en_last_name');
		table.date('birth_date');
		table.date('issue');
		table.integer('expire');
		table.string('issuer');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
