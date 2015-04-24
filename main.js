var json = require('json');
var path = require('path');
var config = require('config');
var auth = require('basic-auth');
var express = require('express');
var Promise = require('bluebird');
var dbopearions = require('./dboperations.js');
var bodyParser = require('body-parser');
var dbConfig = config.get('Global.dbConfig');

var knex = Promise.promisifyAll(require('knex')({
			client : dbConfig.client,
			connection : {
				host : dbConfig.host,
				user : dbConfig.user,
				password : dbConfig.password,
				database : dbConfig.database
			}
		}));
var app = express();
var router = express.Router();

app.use(function (req, res, next) {

	var user = auth(req);
	if (user === undefined) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="et3ebs6126a"');
		res.end('Unauthorized');
	} else {
		obj = new Object();
		obj.name = user['name'];
		obj.passkey = user['pass'];
		dbopearions.checkLoginAsync(obj).then(function (row) {
			console.log("Check Login");
			console.log(row);
			//res.json(row);
			if (row.length > 0) {
				next();
			} else {
				res.statusCode = 401;
				res.setHeader('WWW-Authenticate', 'Basic realm="et3ebs6126a"');
				res.end('Unauthorized');
			}
		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});
	}
	/*
	if (user === undefined || user['name'] !== 'username' || user['pass'] !== 'password') {
	res.statusCode = 401;
	res.setHeader('WWW-Authenticate', 'Basic realm="et3ebs6126a"');
	res.end('Unauthorized');
	} else {
	next();
	}*/
});

app.use("/", router);

//app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
		extended : false
	});
app.use(bodyParser.urlencoded({
		extended : false
	}));
app.use(bodyParser.json());
var jsonParser = bodyParser.json();
dbopearions.initDB();


var rootevent = router.route("/events");

rootevent.get(function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {

		dbopearions.getAllEventAsync().then(function (row) {
			console.log("GET ALL EVENTS");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});

});

rootevent.post(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.name = req.body.event_name;
		obj.start_date = req.body.start_date;
		obj.end_date= req.body.end_date;
		obj.companyid = req.body.companyid;

		dbopearions.insertEventAsync(obj).then(function (row) {
			console.log("ADDED EVENT");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

var rooteventbyid = router.route("/events/:id");

rooteventbyid.put(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;
		obj.name = req.body.event_name;
		obj.start_date = req.body.start_date;
		obj.end_date= req.body.end_date;
		
		dbopearions.updateEventAsync(obj).then(function (row) {
			console.log("UPDATE EVENT");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

rooteventbyid.get(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.getEventAsync(obj).then(function (row) {
			console.log("GET EVENT BY ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

rooteventbyid.delete (jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.deleteEventAsync(obj).then(function (row) {
			console.log("DELETE EVENT BY ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

////////////////USER REST API//////////


var rootuser = router.route("/users");

rootuser.get(function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {

		dbopearions.getAllUserAsync().then(function (row) {
			console.log("GET ALL USERS");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});

});

rootuser.post(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.name = req.body.user_name;
		obj.passkey = req.body.passkey;
		obj.companyid = req.body.companyid;

		dbopearions.insertUserAsync(obj).then(function (row) {
			console.log("ADDED USER");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

var rootuserbyid = router.route("/users/:id");

rootuserbyid.put(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {

		obj = new Object();
		obj.id = req.params.id;
		obj.name = req.body.user_name;
		obj.passkey = req.body.passkey;

		dbopearions.updateUserAsync(obj).then(function (row) {
			console.log("UPDATE USER");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

rootuserbyid.get(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.getUserAsync(obj).then(function (row) {
			console.log("GET USER BY ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

rootuserbyid.delete (jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.deleteUserAsync(obj).then(function (row) {
			console.log("DELETE USER BY ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

////////////////COMPANY REST API///////
var rootcompany = router.route("/companys");

rootcompany.get(function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {

		dbopearions.getAllCompanysAsync().then(function (row) {
			console.log("GET ALL COMPANYS");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});

});

rootcompany.post(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.name = req.body.company_name;

		dbopearions.insertCompanyAsync(obj).then(function (row) {
			console.log("ADDED COMPANY");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

var rootcompanybyid = router.route("/companys/:id");

rootcompanybyid.put(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;
		obj.name = req.body.company_name;

		dbopearions.updateCompanyAsync(obj).then(function (row) {
			console.log("UPDATE COMPANY");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

rootcompanybyid.get(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.getCompanyAsync(obj).then(function (row) {
			console.log("GET COMPANY BY ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

rootcompanybyid.delete (jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.deleteCompanyAsync(obj).then(function (row) {
			console.log("DELETE COMPANY BY ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

var rootcompanybyid = router.route("/companys/events/:id");

rootcompanybyid.get(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.getCompanyEventAsync(obj).then(function (row) {
			console.log("GET COMPANY Events BY comapany ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

var rootcompanybyid = router.route("/companys/users/:id");

rootcompanybyid.get(jsonParser, function (req, res) {

	res.setHeader('Content-Type', 'application/json');
	return new Promise(function (resolver, rej) {
		obj = new Object();
		obj.id = req.params.id;

		dbopearions.getCompanyUserAsync(obj).then(function (row) {
			console.log("GET COMPANY Users BY comapany ID");
			console.log(row);
			res.end(JSON.stringify(row));

		}, function (err) {
			rej(err);
		}).catch (function (e) {
			rej(e);
		});

	});
});

app.listen(3000);
