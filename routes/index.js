var express = require('express');
var router = express.Router();

var name1;
var dob1;
var email1;
var result1;

var name2;
var dob2;
var email2;
var field2;
var result2;

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
    
    if(email==null){  
    	$email = email1;
    	email = email1;
    }
    if(name==null) name = name1;
    
    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
    	//if(err) throw err;
    	var dbo = db.db("test");
    	var db1 = db.db("test");
    	//var patientlogin = dbx.get('patientlogin');
    	//var patientlogin2 = dbx.get('patientlogin');
    	db1.collection("patientlogin").find({email : $email}).toArray(function(err, result){
    	//patientlogin.find({email : $email}).toArray(function(err, result){
    		//if(err) throw err;
    		//res.send(result);
    		//db.close();
    		if(!(result.length>0)){
    			//var add = dbo.collection("patientlogin");
    			dbo.collection("patientlogin").insertOne({
    			//patientlogin2.insertOne({
    				"name" : name,
    				"dob" : dob,
    				"email" : email,
    				"password" : "0000"
    			}, function(err1, doc1){
    				if(err1){
    					res.send("There was a problem adding the information to the patient database.");
    				}
    			});
    		}
    		db.close();
    	});


    	//console.log("hello there");
    	var appointment = dbx.get('appointments');

		//TODO: Do below insertion only if recpt table's remaining slots are >0.
		
    	// Submit to the DB
    	appointment.insert({
        	//"name" : name,
        	"email" : email,
        	//"dob" : dob,
        	"field" : field,
        	"appdate" : appdate
        	//"message" : message 
      }, function (err, doc) {
        	if (err) {
        	    // If it failed, return error
        	    //res.send("There was a problem adding the information to the appointment database.");
        	}
    	});
    	var when = new Date().toString();
    	if(message){
    		console.log("message sent");
    		var msg = dbx.get('queries');
    		msg.insert({"from":email, "to":"rcpt", "when": when, "content" : message});
    	} 
    	else console.log("no message");
    	
    });
    //redirect to success page
    res.redirect('bookingsuccessful.html');
});


router.get('/patientaccountinfo', function(req, res){
    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
        //if(err) throw err;
        var db1 = db.db("test");
        db1.collection("patientlogin").find({email : email1}).toArray(function(err, result){
            //if(err) throw err;
            //res.send(result);
            //db.close();
            //if(!(result.length>0)){
                //var add = dbo.collection("patientlogin");
                /*var obj = JSON.parse(result);
                //window.localStorage.setItem("vStorageName", obj.name);
                //window.localStorage.setItem("vStorageDob", obj.dob);
                name1 = obj.name;
                dob1 = obj.dob;
                alert(obj.name);
                alert(obj.dob);*/
                console.log(result);
                result1 = result;
                //console.log(result.email);
                res.render('patientaccountinfo', {
            		"list" : result
        		});
                //dbo.collection("patientlogin").insertOne({
                //    "name" : name,
                //    "dob" : dob,
                //    "email" : email,
                //    "password" : "0000"
                //}, function(err1, doc1){
                //    if(err1){
                //        res.send("There was a problem adding the information to the patient database.");
                //    }
                //});
            //} 
        });
        db.close();
    });
    //res.render('patientaccountinfo');
    //res.redirect("patientaccountinfo.html");
});

/*Check login details of patients*/
router.post('/plogin', function(req, res){

	// Get our form values. These rely on the "name" attributes
    var $email = req.body.email;
    var $passwd = req.body.passwd;
	//sessionStorage.setItem('email', $email);
    email1 = $email;			
    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
    	//if(err) throw err;
    	var dbo = db.db("test");
    	dbo.collection("patientlogin").find({email : $email, password : $passwd}).toArray(function(err, result){
    		//if(err) throw err;
    		//res.send(result);
    		//db.close();
			//console.log(result[0].dob);
			//console.log(result);
    		if(result.length>0){
    			name1 = result[0].name;
				dob1 = result[0].dob;
				result1 = result;
			
    			res.redirect("patient");
    		}
    		else{
    			res.redirect("failed.html");
    		}
    	});
    });
    
});

/* GET Patient page.*/
router.get('/patient', function(req, res){
	var db = req.db;
	var collection = db.get('queries');
	var coll2 = db.get('casehistory');
	collection.find({$or : [{"from" : email1}, {"to" :  email1}]}, {}, function(e,docs){
		console.log("2 I'm first");
		coll2.find({patient : email1}, {}, function(e1, docs2){
			//console.log(docs);
			console.log(docs2);
			res.render('patient',{
				"querylist" : docs,
				"caselist" : docs2
			});
		});
		
	});
	
});

/* GET editpatientdetails page*/
router.get('/editpatientdetails', function(req, res){
	res.render('editpatientdetails', {
            		"list" : result1
        		});
});

/* GET savepatientdetails page */
router.post('/savepatientdetails', function(req, res){
	
	var db = req.db;
	//var collection = db.get('patientlogin');
	
	var  name = req.body.name;
    var  dob = req.body.dob;
    var  passwd = req.body.passwd;
    
    console.log("name: "+ name);
    console.log("dob: "+ dob);
    console.log("passwd: "+ passwd);
    name1 =  name;
    dob1 =  dob;
    //passwd1 = passwd;
    var collection = db.get('patientlogin');
    //collection.remove({"email" : email1});
    //collection.insert({"name" : name, "dob" : dob, "password" : passwd});
    collection.update({"email" : email1}, {$set : {"name" : name}});
    collection.update({"email" : email1}, {$set : {"dob" : dob}});
    collection.update({"email" : email1}, {$set : {"password" : passwd}});
    
    collection.update({"email" : email1}, {$set : {"name" : name, "dob" : dob, "password" : passwd}}, function(e, result){
    	if(e) throw e;
    	else res.redirect("patientaccountinfo");
    });
	
	
});


router.post('/sendpatientquery', function(req, res){
	var db = req.db;
	
	var to = "rcpt";
	var from = email1;
	var when = new Date().toString();
	var content = req.body.content;
	
	var collection = db.get('queries');
	/*async function doIt(){
		return new Promise((resolve, reject) => {
			try{
				const res = await UpdatePatientDashboard()
	}*/
	//async function updating(){
		collection.insert({"from": from, "to" : to, "when" : when, "content" : content }, function(e, result){
			if(e) console.log(e);
			else res.redirect("patient"); 
		});
	//}
	
	
	
	//var collection2 = db.get('queries');
	/*collection2.find({$or : [{"from" : email1}, {"to" :  email1}]}, {}, function(e,docs){
		console.log("1 I'm first");
		res.render('patient',{
			"querylist" : docs
		});
	});*/
	
	//console.log("1 I'm first");
	//res.redirect("patient");
	//setTimeout(res.redirect("patient"),15000);
});
/*
async function UpdatePatientDashboard(){
	console.log("Starting...");
	try{
		const res = await 
	}
}*/

/*Check login details of staff*/
router.post('/slogin', function(req, res){

    // Get our form values. These rely on the "name" attributes
    var $role = req.body.role;
    var $email = req.body.email;
    var $passwd = req.body.passwd;
    email2 = $email;

    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    //finding from mongodb
    mongoclient.connect(url, function(err,db){
    	//if(err) throw err;
    	var dbo = db.db("test");
    	dbo.collection("stafflogin").find({role : $role, email : $email, password : $passwd}).toArray(function(err, result){
    		//if(err) throw err;
    		//res.send(result);
    		console.log(result);
    		
    		if(result.length>0){
    			name2 = result[0].name;
				dob2 = result[0].dob;
				field2 = result[0].field;
				result2 = result;
				console.log("field: "+result[0].field);
			
    			if($role=="Doctor")
    				res.redirect("staff");
    			else
    				res.redirect("reception");
    		}
    		else{
    			res.redirect("failed.html");
    		}
    	});
    });

});

router.get('/reception', function(req, res){
	res.render("reception");
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('patientlogin');
    collection.find({"email": email1},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});


router.get('/staff', function(req, res){
	var db = req.db;
	var collection = db.get("appointments");
	collection.find({"field": field2}, {}, function(e, docs){
		//var coll2 = db.get("patientlogin");
		var list2 = new Array();
		var i=0;
		//var email = 
		//docs[0].dob = "Hello mic testing 1, 2, 3..";
		//console.log(docs);
		//console.log(docs);
		//console.log("looooooooop");
		/*for(; i<docs.length; ++i){
			var x;
			console.log(docs[i].email);
			coll2.find({"email" : docs[i].email}, {}, function(e1, docs2){
				if(e1) throw e1;
				else if(docs2[0]){ 
					//console.log(docs2[0].name);
					x = docs2[0].name;
					//docs[i].field = "s-say the name";
					//console.log(docs[i].field);
					console.log(docs2[0].field);
					//docs2[i].password = coll[i].
					//list2.push(docs2[0]);
					//console.log(list2[i]);
					//docs[i].pname = docs2[0].dob;
				}
				//if(docs2){
					//console.log(docs2[0].dob);
					//docs[i].dob = docs2[0].dob;
					//docs[i].name = docs2[0].name;
					
				//}
				//console.log("docs2"+docs2);
				//console.log(docs[i].email);
				//list2+=docs2[0];
				//docs[i].name = docs2[0].name;
				//console.log(docs2[0].name);
				//console.log(docs2[0].dob);
				//console.log(list2[i][0].dob);
				//console.log(docs);
			});
			docs[i].field = x;
			//console.log(docs[i]);
			//console.log(docs[i].email);
			//console.log(list2[i].appdate);
		}*/
		console.log(docs);
		//console.log("/looooooooop");
		//console.log("list2"+list2);
		res.render("staff",{
			"appointment" : docs //,
			// "pdetails" : list2
		});
		//console.log("list2"+list2);
		//console.log(list2[0].dob);
			
	});
});

/* GET doctoraccountinfo */
router.get('/doctoraccountinfo', function(req, res){
    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
        //if(err) throw err;
        var db1 = db.db("test");
        db1.collection("stafflogin").find({email : email2}).toArray(function(err, result){
            //if(err) throw err;
            //res.send(result);
            //db.close();
            //if(!(result.length>0)){
                //var add = dbo.collection("patientlogin");
                /*var obj = JSON.parse(result);
                //window.localStorage.setItem("vStorageName", obj.name);
                //window.localStorage.setItem("vStorageDob", obj.dob);
                name1 = obj.name;
                dob1 = obj.dob;
                alert(obj.name);
                alert(obj.dob);*/
                console.log(result);
                result2 = result;
                //res.render('doctoraccountinfo');
                res.render('doctoraccountinfo', {
            		"list" : result
        		});
        });
        db.close();
    });
});

/* GET editdoctordetails page*/
router.get('/editdoctordetails', function(req, res){
	res.render('editdoctordetails', {
            		"list" : result2
        		});
});

/* GET savedoctordetails page */
router.post('/savedoctordetails', function(req, res){
	
	var db = req.db;
	//var collection = db.get('patientlogin');
	
	var  name = req.body.name;
    var  dob = req.body.dob;
    var  passwd = req.body.passwd;
    
    console.log("name: "+ name);
    console.log("dob: "+ dob);
    console.log("passwd: "+ passwd);
    name2 =  name;
    dob2 =  dob;
    //passwd1 = passwd;
    var collection = db.get('stafflogin');
    //collection.remove({"email" : email2});
    //collection.insert({"role": "Doctor", "email": email2, "name" : name, "dob" : dob, "field" : field2, "password" : passwd});
    
    //collection.update({"email" : email2}, {$set : {"name" : name}});
    //collection.update({"email" : email2}, {$set : {"dob" : dob}});
    //collection.update({"email" : email2}, {$set : {"password" : passwd}});
    
    collection.update({"email" : email2}, {$set : {"name" : name, "dob" : dob, "password" : passwd}}, function(e, result){
    	if(e) throw e;
    	else res.redirect("doctoraccountinfo");
    });
    
    
	
	
});

/* GET ptable */
router.get('/ptable', function(req, res){
	var db = req.db;
	var collection = db.get('casehistory');
	
	collection.find({"docmail":email2}, {}, function(err, docs){
		//res.redirect("/");
		console.log(docs);
		res.render("ptable",{
			"cases" : docs
		});
	});
});


/* GET receptionistaccinfo */
router.get('/receptionistaccinfo', function(req, res){
    //finding from mongodb
    var mongoclient = require('mongodb').MongoClient;
    var url = "mongodb+srv://User12:pwd123@hestia-iz6gz.mongodb.net/";

    mongoclient.connect(url, function(err,db){
        //if(err) throw err;
        var db1 = db.db("test");
        db1.collection("stafflogin").find({email : email2}).toArray(function(err, result){
            //if(err) throw err;
            //res.send(result);
            //db.close();
            //if(!(result.length>0)){
                //var add = dbo.collection("patientlogin");
                /*var obj = JSON.parse(result);
                //window.localStorage.setItem("vStorageName", obj.name);
                //window.localStorage.setItem("vStorageDob", obj.dob);
                name1 = obj.name;
                dob1 = obj.dob;
                alert(obj.name);
                alert(obj.dob);*/
                console.log(result);
                result2 = result;
                //res.render('doctoraccountinfo');
                res.render('receptionistaccinfo', {
            		"list" : result
        		});
        });
        db.close();
    });
});


/* GET editrcptdetails page*/
router.get('/editrcptdetails', function(req, res){
	res.render('editrcptdetails', {
            		"list" : result2
        		});
});

/* GET savercptdetails page */
router.post('/savercptdetails', function(req, res){
	
	var db = req.db;
	//var collection = db.get('patientlogin');
	
	var  name = req.body.name;
    var  dob = req.body.dob;
    var  passwd = req.body.passwd;
    
    console.log("name: "+ name);
    console.log("dob: "+ dob);
    console.log("passwd: "+ passwd);
    name2 =  name;
    dob2 =  dob;
    //passwd1 = passwd;
    var collection = db.get('stafflogin');
    //collection.remove({"email" : email2});
    //collection.insert({"role": "Receptionist", "email": email2, "name" : name, "dob" : dob, "field" : field2, "password" : passwd});
	
	//collection.update({"email" : email2}, {$set : {"name" : name}});
    //collection.update({"email" : email2}, {$set : {"dob" : dob}});
    //collection.update({"email" : email2}, {$set : {"password" : passwd}});
    
    collection.update({"email" : email2}, {$set : {"name" : name, "dob" : dob, "password" : passwd}}, function(e, result){
    	if(e) throw e;
    	else res.redirect('receptionistaccinfo'); 
    });
	
	
});



module.exports = router;

