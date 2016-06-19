var pg = require('pg');
var defaults = require('./defaults.js');
var conString = "postgres://"+defaults.user+":"+defaults.password+"@"+defaults.host+"/"+defaults.database;

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 10 (also configurable)
var globalClient = null;
var globalDone = null;

module.exports = {
	queryPerConnection: function(query, CALLBACK){
		pg.connect(conString, function(err, client, done) {
			if(err) {
				return null;
			}else{
				client.query('SET search_path = admin', function(err, result) {
					if(err) {
						done();
						return err;
					}else{
						client.query(query, function(err, result) {
						
							if(err) {
								done();
								return err;
							}else{
								CALLBACK(result);
								done();
								return null;
							}
						});
						return null;
					}
				});
			}
		});
	},
	query: function(query, CALLBACK){
		if(globalClient == null || globalDone == null){
			
			pg.connect(conString, function(err, client, done) {
				globalClient = client;
				globalDone = done;
				if(err) {
					return null;
				}else{
					client.query('SET search_path = admin', function(err, result) {
						if(err) {
							done();
							return err;
						}else{
							client.query(query, function(err, result) {
							
								if(err) {
									return err;
								}else{
									CALLBACK(result);
									return null;
								}
							});
							return null;
						}
					});
				}
			});
		}else{
			globalClient.query(query, function(err, result) {
			
				if(err) {
					return err;
				}else{
					CALLBACK(result);
					return null;
				}
			});
		}
	},
	done: function(){
		globalDone();
	}
}