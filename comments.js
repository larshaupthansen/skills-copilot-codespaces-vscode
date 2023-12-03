// Create Webserver
// By: Ronny Tompot
// Date: 2016-05-26
// Edited: 2016-05-27

// Include the required modules
var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');

// Include config file
var config = require('./config.js');

// Set the headers
var headers = {
	'User-Agent': config.userAgent
};

// Set the options
var options = {
	url: config.url,
	method: 'GET',
	headers: headers
};

// Create a new file to store the data
var file = fs.createWriteStream('comments.txt');

// Create a new request
var req = request(options);

// Pipe the data to the file
req.pipe(file);

// When the request is done
req.on('end', function() {
	// Read the file and split the lines
	fs.readFile('comments.txt', 'utf8', function(err, data) {
		if (err) throw err;
		var lines = data.split('\n');
		var comments = [];
		var comment = {};
		var i = 0;
		var j = 0;

		// Loop through the lines
		for (i = 0; i < lines.length; i++) {
			// If the line contains a comment
			if (lines[i].indexOf('Comment') > -1) {
				// Split the line on the colon
				var line = lines[i].split(':');
				// Add the comment to the array
				comment.comment = line[1].trim();
				comments.push(comment);
				// Reset the comment object
				comment = {};
				// Increase the counter
				j++;
			}
		}

		// Send the comments to the client
		router.get('/', function(req, res) {
			res.json(comments);
		});
	});
});

// Export the router
module.exports = router;