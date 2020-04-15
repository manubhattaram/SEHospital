var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*Check login details of patients*/
router.post('/patientlogin', function(req, res){

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
router.post('/stafflogin', function(req, res){

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
