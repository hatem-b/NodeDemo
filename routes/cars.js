/**
	cars REST API
	server/cars	
*/

var express = require('express');
var router = express.Router();
var q = require('q');
var cars = require('./cars.json');
var DAO = require('./dataAccess.js')("cars", q);


/** 
	GET on cars/
	return cars list
*/
router.get('/', function (req, res) {
	setTimeout(function () {
		DAO.getAll()
			.then(function (result) {
				res.send(result);
			})
			.catch(function (err) {
				res.send(new Error(err));
			});
	}, 700);

});

/** 
	GET on cars/:id
	return a car by its id
*/
router.get('/:id', function (req, res) {
	setTimeout(function () {
		DAO.getById(req.params.id)
			.then(function (result) {
				res.send(result);
			})
			.catch(function (err) {
				res.send(new Error(err));
			});
	}, 700);
});

/** 
	POST on cars/
	create a new car
*/
router.post('/', function (req, res) {
	var car = req.body.data;


	DAO.auto_increment().then(function (newId) {
		car.id = newId;
		//car.date = new Date();

		DAO.add(car)
			.then(function (result) {
				res.send(result);
			})
			.catch(function (err) {
				res.send(new Error(err));
			});
	});

});

/** 
	PUT on cars/
	update an existing car
*/
router.put('/', function (req, res) {
	var newCar = req.body.data;

	DAO.update(newCar)
		.then(function (result) {
			res.send(result);
		})
		.catch(function (err) {
			res.send(new Error(err));
		});

});

/** 
	DELETE on cars/:id
	delete a car by its id
*/
router.delete('/:id', function (req, res) {

	DAO.delete(req.params.id)
		.then(function (result) {
			res.send(result);
		})
		.catch(function (err) {
			res.send(new Error(err));
		});


});


module.exports = router;