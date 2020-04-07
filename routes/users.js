var express = require('express');
var router = express.Router();

//Patient Login Page
router.get('/patientlogin', function(req, res, next) {
  res.send('respond with a resource');
});

//Staff Login Page
router.get('/stafflogin', function(req, res, next) {
  res.send('respond with a resource');
});

/*//Register Page
router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});*/


module.exports = router;
