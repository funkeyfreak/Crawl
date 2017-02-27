var text = require('textbelt');


// Request format: 'name -> message'
exports.contact = function (request) {
	var name = request.split("->")[0];
	var sender_uid = 0; //select sender_uid

	var numbers = 'SELECT number FROM receiver_numbers JOIN reciever WHERE receiver_numbers.receiver_uid = reciever.uid AND ' + 
		'receiver_numbers.receiver_uid != ' + sender_uid + ' AND sender_uid = ' + sender_uid;

		if (numbers.length() <= 0) {
			console.error("Could not find any numbers associated with the current user.");
		}
		for (var i = 0; i < numbers.length(); i++) {
			text(numbers[i], 
			    request.split("->")[1].trim(),
			    null, //db lookup value
			    function(err) {
			    	console.error("Could not send sms: " + err);
			   });
			}
}


exports.createProfile = function(name, password) {
	//'BEGIN IF NOT EXISTS (INSERT INTO Sender (name, password) VALUES(' + name + ', ' + password + ') END'

	if(false) { //if above query fails
		console.error("Could not create profile, username already exists")
	}
}

exports.addNumber = function (name, number) {
	var sender_uid = 0; //select sender_uid
	var receiver_uid = 'INSERT INTO Receiver (sender_uid, name) VALUES(' + sender_uid + ', ' + name + ')';
	//'INSERT INTO Reciver_numbers (reciver_uid, number)'
}

exports.authorize = function () {
	// authorize user and get sender_uid using bot dialog ms fw api
}
