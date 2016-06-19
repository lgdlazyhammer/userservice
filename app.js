var initdb = require("./initdb.js");
var dbservice = require("./dbservice.js");

initdb.initdb();

dbservice.query("SELECT * FROM users", function(result){
	console.log(result);
});

dbservice.query("SELECT * FROM users", function(result){
	console.log(result);
});