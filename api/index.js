/** 
*	@fileOverview API
*
*	API root
*
*	available ressources : cars
*/

var express = require('express');
var router = express.Router();
var cars = require('./cars');


router.use('/cars', cars);





module.exports = router;
