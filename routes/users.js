var express = require('express');
var router = express.Router();

//Patient Login Page
router.get('/patientlogin', (req, res)=> res.render('patientlogin'));

//Staff Login Page
router.get('/stafflogin', (req, res)=> res.render('stafflogin'));

/*//Register Page
router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});*/


module.exports = router;
