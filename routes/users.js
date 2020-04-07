var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

const User=require('../models/User');

//Patient Login Page
router.get('/patientlogin', (req, res)=> res.render('patientlogin'));

//Staff Login Page
router.get('/stafflogin', (req, res)=> res.render('stafflogin'));

/*POST to appointment service*/
router.post('/appointment' , function(req,res){
	//console.log(req.body)
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

    let errors=[];

    //Check required fields
    if(!name||!email||!dob||!field||!appdate||!message){
    	errors.push({ msg: 'Please fill in all fields' })
    }

    if(errors.length>0){
    		res.render('appointment',{
    			errors
    		});
    } else{
    	User.findOne({email: email})
    	.then(user =>{
    		if(user){
    			//User exists
    			errors.push({  msg: 'Email is already registered' });
    			res.render('appointment',{
    				errors
    			});
    		} else{
    			const newUser = new User({
    				name,
    				email,
    				"password":"0000",
    				dob
    			});

    			bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
    				if(err) throw err;

    				//Set pw to hashed
    				newUser.password=hash;

    				newUser.save()
    					.then(user => {
    						res.redirect('/users/patientlogin')
    					})
    					.catch(err =>console.log(err));
    			}))
    		}
    	});
    }
    //finding from mongodb
    /*var mongoclient = require('mongodb').MongoClient;
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
    res.redirect('bookingsuccessful.html');*/
});


module.exports = router;
