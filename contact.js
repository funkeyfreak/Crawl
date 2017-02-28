var text = require('textbelt');
var sql = require('mssql');


// Request format: 'name -> message'
exports.contact = function (request, session) {
	var name = request.split("->")[0];
	var numbers;
	sql.connect(process.env.CrawServerDB).then(function() {
	    // Queries
	    new sql.Request().query(`SELECT number FROM receiver_numbers JOIN reciever WHERE receiver_numbers.receiver_uid = reciever.uid AND receiver_numbers.receiver_uid != ${session.userData.uid} AND receiver.sender_uid = ${session.userData.uid}`).then(function(recordset) {
	        console.dir(recordset);
	        numbers = recordset;
	    }).catch(function(err) {
	        console.error(err);
	    });
	});

	if (numbers.length() <= 0) {
		console.error("Could not find any numbers associated with the current user.");
	}
	for (var i = 0; i < numbers.length(); i++) {
		text(numbers[i].number, 
		    request.split("->")[1].trim(),
		    null,
		    function(err) {
		    	console.error("Could not send sms: " + err);
		   });
		}
}

exports.createProfile = function(name, password) {
	sql.connect(process.env.CrawServerDB).then(function() {
	    // Queries
	    new sql.Request().query(`BEGIN IF NOT EXISTS (INSERT INTO Sender (name, password) VALUES(${name}, ${password})) END`).then(function(recordset) {
	       console.dir(recordset);
	    }).catch(function(err) {
	        console.error(err);
	    });
	});
}

exports.addNumber = function (session, name, number) {
	var receiver_uid = `INSERT INTO Receiver (sender_uid, name) VALUES('${session.userData.uid}, ${name})`;

	sql.connect(process.env.CrawServerDB).then(function() {
	    // Queries
	    new sql.Request().query(`INSERT INTO Receiver (sender_uid, name) VALUES('${session.userData.uid}, ${name})`).then(function(recordset) {
			console.dir(recordset);
			new sql.Request().query(`INSERT INTO Reciver_numbers (${recordset[0].receiver_uid}, ${number})`).then(function(recordset) {
				console.dir(recordset);
			}).catch(function(err) {
		    	console.error(err);
			});
	    }).catch(function(err) {
	        console.error(err);
	    });
	});
}

exports.authorize = function (session, results) {
	var userpass = results.response.split(" ");
	sql.connect(process.env.CrawServerDB).then(function() {
	    // Queries
	    new sql.Request().query(`SELECT uid FROM Sender WHERE Sender.person = ${userpass[0]} AND Sender.password = ${userpass[1]}`).then(function(recordset) {
	       console.dir("Authorized: " + recordset);
	       session.userData.uid = recordset[0].uid;
	       return "Successfully authorized";
	    }).catch(function(err) {
	        session.userData.uid = -1;
	       return "Could not authorize";
	    });
	});
}
