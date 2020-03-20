var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*POST to appointment service*/
router.post('/appointment' , function(req,res){
	// Set our internal DB variable
    var dbx = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var email = req.body.email;
    var dob = req.body.dob;
    var field = req.body.field;
    var appdate = req.body.appdate;
    var message = req.body.message;
    var $email = email;

    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
    	//if(err) throw err;
    	var dbo = db.db("test");
    	var db1 = db.db("test");
    	db1.collection("patientlogin").find({email : $email}).toArray(function(err, result){
    		//if(err) throw err;
    		//res.send(result);
    		//db.close();
    		if(!(result.length>0)){
    			//var add = dbo.collection("patientlogin");
    			dbo.collection("patientlogin").insertOne({
    				"email" : email,
    				"password" : "0000"
    			}, function(err1, doc1){
    				if(err1){
    					//res.send("There was a problem adding the information to the patient database.");
    				}
    			});
    		}
    		db.close();
    	});


    	console.log("hello there");
    	var appointment = dbx.get('appointments');

    	// Submit to the DB
    	appointment.insert({
        	"name" : name,
        	"email" : email,
        	"dob" : dob,
        	"field" : field,
        	"appdate" : appdate,
        	"message" : message
    	}, function (err, doc) {
        	if (err) {
        	    // If it failed, return error
        	    res.send("There was a problem adding the information to the appointment database.");
        	}
    	});
    });
    //redirect to success page
    res.redirect('bookingsuccessful.html');
});

/*Check login details of patients*/
router.post('/plogin', function(req, res){

	// Get our form values. These rely on the "name" attributes
    var $email = req.body.email;
    var $passwd = req.body.passwd;

    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
    	//if(err) throw err;
    	var dbo = db.db("test");
    	dbo.collection("patientlogin").find({email : $email, password : $passwd}).toArray(function(err, result){
    		//if(err) throw err;
    		//res.send(result);
    		db.close();

    		if(result.length>0){
    			res.redirect("patient.html");
    		}
    		else{
    			res.redirect("failed.html");
    		}
    	});
    });

});

/*Check login details of staff*/
router.post('/slogin', function(req, res){

    // Get our form values. These rely on the "name" attributes
    var $role = req.body.role;
    var $email = req.body.email;
    var $passwd = req.body.passwd;

    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    //finding from mongodb
    mongoclient.connect(url, function(err,db){
    	//if(err) throw err;
    	var dbo = db.db("test");
    	dbo.collection("stafflogin").find({role : $role, email : $email, password : $passwd}).toArray(function(err, result){
    		//if(err) throw err;
    		//res.send(result);
    		db.close();

    		if(result.length>0){
    			res.redirect("staff.html");
    		}
    		else{
    			res.redirect("failed.html");
    		}
    	});
    });

});

module.exports = router;
