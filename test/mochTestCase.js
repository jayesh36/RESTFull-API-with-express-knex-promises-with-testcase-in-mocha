var assert = require('assert');

var request = require('supertest');
var age = request.agent();
var should = require('should');
var recentevent = "";
var recentuser = "";
var recentcompany = "";

describe('dbop', function () {

	it('should axpect 401 Unauthorized', function (done) {
		request("localhost:3000")
		.get("/users")
		.expect(401) //Status code
		.end(function (err, res) {
			if (err) {
				throw err;
			}

			done();
		});

	});

	function loginUser() {
		return function (done) {
			request("localhost:3000")
			.post('/users')
			.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
			.expect(200)
			.end(onResponse);

			function onResponse(err, res) {
				if (err)
					return done(err);
				return done();
			}
		};
	}
	it('should authorized', loginUser());

	function getAllUser() {
		return function (done) {
			request("localhost:3000")
			.get("/users")
			.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
			.set('accept', 'application/json')
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw new Error("error");
				}
				res.should.have.body;
				console.log(res.body);

				done();
			});

		}
	}

	it('should get all users', getAllUser());

	it('should add user', function (done) {
		request("localhost:3000")
		.post("/users")
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.send({
			"user_name" : "testUser",
			"passkey" : "testKey",
			"companyid" : "10"
		})
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			// Should.js fluent syntax applied
			//res.body.should.have.property('id');
			res.should.have.body;
			console.log(res.body);
			recentuser = res.body.id;
			//.should.not.equal(null);
			//res.body.passkey.should.not.equal(null);

			done();
		});

	});

	it('should have atleast one new User just added', getAllUser());

	it('should get all companys', getAllCompany());

	it('should add company', function (done) {
		request("localhost:3000")
		.post("/companys")
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.send({
			"company_name" : "TESTCASE"
		})
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			// Should.js fluent syntax applied
			//res.body.should.have.property('id');
			res.should.have.body;
			console.log(res.body);
			recentcompany = res.body.id;
			//.should.not.equal(null);
			//res.body.passkey.should.not.equal(null);

			done();
		});

	});

	it('should have atleast one new company just added', getAllCompany());

	it('should update User', function (done) {
		request("localhost:3000")
		.put("/users/" + recentuser)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.send({
			"user_name" : "testUserNewName",
			"passkey" : "testKey",
			"companyid" : recentcompany
		})
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});
	it('user list with updated user', getAllUser());

	it('should delete User', function (done) {
		request("localhost:3000")
		.delete ("/users/" + recentuser)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});
	it('user list of remaining users', getAllUser());

	function getAllCompany() {
		return function (done) {
			request("localhost:3000")
			.get("/companys")
			.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
			.set('accept', 'application/json')
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw new Error("error");
				}
				res.should.have.body;
				console.log(res.body);

				done();
			});

		}
	}

	it('should update company', function (done) {
		request("localhost:3000")
		.put("/companys/" + recentcompany)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.send({
			"company_name" : "NEWTESTCASE"
		})
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});
	it('company list with updated company', getAllCompany());

	function getAllEvents() {
		return function (done) {
			request("localhost:3000")
			.get("/events")
			.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
			.set('accept', 'application/json')
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw new Error("error");
				}
				res.should.have.body;
				console.log(res.body);

				done();
			});

		}
	}

	it('should get all Events', getAllEvents());

	it('should add Event', function (done) {
		request("localhost:3000")
		.post("/events")
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.send({
			"event_name" : "testCase",
			"companyid" : recentcompany
		})
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			// Should.js fluent syntax applied
			//res.body.should.have.property('id');
			res.should.have.body;
			console.log(res.body);
			recentevent = res.body.id;
			//.should.not.equal(null);
			//res.body.passkey.should.not.equal(null);

			done();
		});

	});

	it('should have atleast one new Event just added', getAllEvents());

	it('should update Event', function (done) {
		request("localhost:3000")
		.put("/events/" + recentevent)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.send({
			"event_name" : "NewtestCase",
			"companyid" : recentcompany
		})
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});

	it('event list with updated event', getAllEvents());

	it('should return list of events for given company id', function (done) {
		request("localhost:3000")
		.get("/companys/events/" + recentcompany)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});

	it('should return list of users for given company id', function (done) {
		request("localhost:3000")
		.get("/companys/users/" + recentcompany)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});

	it('should delete event', function (done) {
		request("localhost:3000")
		.delete ("/events/" + recentevent)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});
	it('event list of remaining events', getAllEvents());

	it('should delete company', function (done) {
		request("localhost:3000")
		.delete ("/companys/" + recentcompany)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});
	it('company list of remaining companys', getAllCompany());

	it('should delete User', function (done) {
		request("localhost:3000")
		.delete ("/users/" + recentuser)
		.set("Authorization", "basic " + new Buffer("TESTUS:passkey").toString("base64"))
		.set('accept', 'application/json')
		.expect(200) //Status code
		.end(function (err, res) {
			if (err) {
				throw new Error("error");
			}
			res.should.have.body;

			done();
		});

	});
	it('user list of remaining users', getAllUser());

});
