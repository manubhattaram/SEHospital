var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*POST to appointment service*/
router.post('/appointment' , function(req,res){
	// Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var email = req.body.email;
    var dob = req.body.dob;
    var field = req.body.field;
    var appdate = req.body.appdate;
    var message = req.body.message;
    
    // Set our collection
    var appointment = db.get('appointments');

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
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And redirect back to main page
            res.redirect('/');
        }
    });
});

/*Check login details of patients*/
router.post('/plogin', function(req, res){
	// Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var email = req.body.email;
    var passwd = req.body.passwd;
    
    // Set our collection
    var plogin = db.get('patientlogin');

    // Find from the DB
    var result1 = plogin.find({
    	"email" : email, 
    	"password" : passwd
    });
    res.redirect('/');
});

/*Check login details of staff*/
router.post('/plogin', function(req, res){
	// Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var role = req.body.role;
    var email = req.body.email;
    var passwd = req.body.passwd;
    
    // Set our collection
    var plogin = db.get('stafflogin');

    // Find from the DB
    var result1 = plogin.find({
    	"role" :  role,
    	"email" : email, 
    	"password" : passwd
    });
    res.redirect('/');
});


module.exports = router;
