var Promise = require('bluebird');
var knex = Promise.promisifyAll(require('knex')({
			client : 'mysql',
			connection : {
				host : '127.0.0.1',
				user : 'root',
				password : '',
				database : 'testdb'
			}
		}));

var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';

module.exports.encrypt = function (text) {
	var cipher = crypto.createCipher(algorithm, password)
		var crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex');
	return crypted;
};

function encrypt(text) {
	var cipher = crypto.createCipher(algorithm, password)
		var crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex');
	return crypted;
};

function decrypt(text) {
	var decipher = crypto.createDecipher(algorithm, password)
		var dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8');
	return dec;
};

module.exports.decrypt = function (text) {
	var decipher = crypto.createDecipher(algorithm, password)
		var dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8');
	return dec;
};

module.exports.initDB = function () {
	knex.schema.hasTable('users').then(function (exists) {
		if (!exists) {
			return knex.schema.createTable('users', function (t) {
				t.increments('id').primary();
				t.string('user_name', 100);
				t.string('passkey', 500);
			}).then(function(){
			return knex('users').insert({user_name: 'testUser', passkey: encrypt('passkey')});
			});
		}
	});

	knex.schema.hasTable('companys').then(function (exists) {
		if (!exists) {
			return knex.schema.createTable('companys', function (t) {
				t.increments('id').primary();
				t.string('company_name', 100);
			});
		}
	});

	knex.schema.hasTable('company_user_mapping').then(function (exists) {
		if (!exists) {
			return knex.schema.createTable('company_user_mapping', function (t) {
				t.string('company_id', 100);
				t.string('user_id', 100);
			});
		}
	});

	knex.schema.hasTable('company_event_mapping').then(function (exists) {
		if (!exists) {
			return knex.schema.createTable('company_event_mapping', function (t) {
				t.string('company_id', 100);
				t.string('event_id', 100);
			});
		}
	});

	knex.schema.hasTable('events').then(function (exists) {
		if (!exists) {
			return knex.schema.createTable('events', function (t) {
				t.increments('id').primary();
				t.string('event_name', 100);
				t.date('start_date');
				t.date('end_date');
				t.timestamps();
			});
		}
	});

};

module.exports.checkLoginAsync = function (user) {
	console.log(encrypt(user.passkey));
	return new Promise(function (resolve, reject) {
		knex.select('*').from('users').where({
			'user_name' : user.name,
			"passkey" : encrypt(user.passkey)
		}).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

/////////////All OPERATIONS of EVENTS table///////////


module.exports.getEventAsync = function (event) {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('events').where('id', event.id).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.insertEventAsync = function (event) {
	var newevent = event;
	return new Promise(function (resolve, reject) {

		if (event.companyid == "" || event.companyid == undefined) {
			throw new Error("companyid is required");
		}

		knex.select('*').from('companys').where('id', event.companyid).then(function (row) {

			console.log("--------------ROW-----------");
			console.log(row.length);
			if (row.length > 0) {
				knex('events').insert({

					event_name : event.name,
					start_date : event.start_date,
					end_date:event.end_date

				}).then(function (result) {
					newevent.id = result[0];
					knex('company_event_mapping').insert({
						event_id : result,
						company_id : event.companyid
					}).then(function (result) {

						resolve(newevent);

					}).catch (function (e) {
						reject(e);
					});
				}).then(function (result) {

					resolve(newevent);

				}).catch (function (e) {
					reject(e);
				})
					.error(function (error) {
						reject(error);
					});
			} else {
				throw new Error("companyid is not available");
			}
			//resolve(row);
		}).catch (Error, function (e) {

			console.log(e);
		})
			.catch (function (e) {
				console.log(e);
				reject(e);
			})
				.error(function (error) {
					reject(error);
				});

	}).catch (Error, function (e) {
		console.log(e);
	});
};

module.exports.updateEventAsync = function (event) {

	return new Promise(function (resolve, reject) {

		if (event.id == "" || event.id == undefined) {
			throw new Error("events id is required to update data");
		}

		knex('events').update({

			event_name : event.name,
			start_date : event.start_date,
			end_date:event.end_date
			
		}).where('id', event.id).then(function (result) {

			resolve(event);

		}).catch (Error, function (e) {
			console.log(e);
		})
			.catch (function (e) {
				reject(e);
			})
				.error(function (error) {
					reject(error);
				});
	}).catch (Error, function (e) {
		return e;
	});
};

module.exports.deleteEventAsync = function (id) {
	return new Promise(function (resolve, reject) {
		knex.delete ('*').from('events').where('id', id.id).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.getAllEventAsync = function () {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('events').then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

/////////////All OPERATIONS of USERS table///////////


module.exports.getUserAsync = function (user) {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('users').where('id', user.id).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.insertUserAsync = function (user) {

	var newuser = new Object();
	newuser = user;

	return new Promise(function (resolve, reject) {

		if (user.companyid == "" || user.companyid == undefined) {
			throw new Error("companyid is required");
		}

		knex.select('*').from('companys').where('id', user.companyid).then(function (row) {

			console.log("--------------ROW-----------");
			console.log(row.length);
			if (row.length > 0) {
				knex('users').insert({

					user_name : user.name,
					passkey : encrypt(user.passkey)
				}).then(function (result) {
					newuser.id = result[0];
					knex('company_user_mapping').insert({

						user_id : result,
						company_id : user.companyid
					}).then(function (result) {

						resolve(newuser);

					}).catch (function (e) {
						reject(e);
					});
				}).then(function (result) {

					resolve(newuser);

				}).catch (function (e) {
					reject(e);
				})
					.error(function (error) {
						reject(error);
					});
			} else {
				throw new Error("companyid is not available");
			}
			//resolve(row);
		}).catch (Error, function (e) {

			console.log(e);
		})
			.catch (function (e) {
				console.log(e);
				reject(e);
			})
				.error(function (error) {
					reject(error);
				});

	}).catch (Error, function (e) {
		console.log(e);
	});

};

module.exports.updateUserAsync = function (user) {
	return new Promise(function (resolve, reject) {

		if (user.id == "" || user.id == undefined) {
			throw new Error("user id is required to update data");
		}

		knex('users').update({

			user_name : user.name,
			passkey : encrypt(user.passkey)

		}).where('id', user.id).then(function (result) {

			resolve(user);

		}).catch (Error, function (e) {
			console.log(e);
		})
			.catch (function (e) {
				reject(e);
			})
				.error(function (error) {
					reject(error);
				});
	}).catch (Error, function (e) {
		console.log(e);
	});
};

module.exports.deleteUserAsync = function (id) {
	return new Promise(function (resolve, reject) {
		knex.delete ('*').from('users').where('id', id.id).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.getAllUserAsync = function () {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('users').then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

////////////////////////ALL OPERATIONS OF COMPANY TABLE ////////////////

module.exports.getCompanyAsync = function (id) {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('companys').where('id', id.id).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.getCompanyEventAsync = function (company) {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('events').whereIn('id', (knex.select('event_id').from('company_event_mapping').where('company_id', company.id))).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.getCompanyUserAsync = function (user) {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('users').whereIn('id', (knex.select('user_id').from('company_user_mapping').where('company_id', user.id))).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.insertCompanyAsync = function (company) {
	var newcompany = company;
	return new Promise(function (resolve, reject) {
		knex('companys').insert({

			company_name : company.name

		}).then(function (result) {
			newcompany.id = result[0];
			resolve(newcompany);

		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.updateCompanyAsync = function (company) {

	return new Promise(function (resolve, reject) {

		if (company.id == "" || company.id == undefined) {
			throw new Error("company id is required to update data");
		}

		knex('companys').update({

			company_name : company.name

		}).where('id', company.id).then(function (result) {

			resolve(company);

		}).catch (Error, function (e) {
			console.log(e);
		})
			.catch (function (e) {
				reject(e);
			})
				.error(function (error) {
					reject(error);
				});
	}).catch (Error, function (e) {
		console.log(e);
	});
};

module.exports.deleteCompanyAsync = function (id) {
	return new Promise(function (resolve, reject) {
		knex.delete ('*').from('companys').where('id', id.id).then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};

module.exports.getAllCompanysAsync = function (id) {
	return new Promise(function (resolve, reject) {
		knex.select('*').from('companys').then(function (row) {

			console.log("--------------ROW-----------");
			//console.log(row);
			resolve(row);
		}).catch (function (e) {
			reject(e);
		})
			.error(function (error) {
				reject(error);
			});
	});
};
