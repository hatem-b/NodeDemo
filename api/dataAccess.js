/**
*	@fileOverview dataAccess
*
*	generic data access service
*
*	using NoSql data (azure storage)
*/

var azure = require('azure-storage');

const ACCOUNT_NAME = "hatem";
const ACCOUNT_KEY = "Sx7t94GfDToONiuVGuA9UBHrjqlF9nN7ovHh1JSHW+p29UZyP69svgNSMnMrZG2QngZYFPeHxl7elvNdkWfnIA==";
var TABLE_NAME = "";
var $q;

var dataAccess = {};


// add necessary properties for azure storage
var wrapEntity = function (object) {
	object.RowKey = object.id.toString();
	object.PartitionKey = object.id.toString();
	return object;
};

// remove azure storage properties
var unwrapEntity = function (entity, removeKeys = true) {

	if (removeKeys) {
		delete entity.RowKey;
		delete entity.PartitionKey;
	}

	delete entity["odata.etag"];
	delete entity["odata.metadata"];
	delete entity.Timestamp;
	return entity;
};


dataAccess.add = function (object) {
	var deferred = $q.defer();
	var entity = wrapEntity(object);

	dataAccess.tableService.insertEntity(TABLE_NAME, entity, function (error, result, response) {
		if (!error) {
			deferred.resolve(result);
		} else {
			deferred.reject(error);
		}
	});
	return deferred.promise;
};

dataAccess.update = function (object) {
	var deferred = $q.defer();
	var entity = wrapEntity(object);

	dataAccess.tableService.replaceEntity(TABLE_NAME, entity, function (error, result, response) {
		if (!error) {
			deferred.resolve(result);
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
};


dataAccess.getAll = function () {
	var deferred = $q.defer();

	var query = new azure.TableQuery();
	dataAccess.tableService.queryEntities(TABLE_NAME, query, null, function (error, result, response) {
		if (!error) {
			deferred.resolve(response.body.value.map(unwrapEntity));
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
};

dataAccess.getById = function (id) {
	var deferred = $q.defer();

	dataAccess.tableService.retrieveEntity(TABLE_NAME, id.toString(), id.toString(), function (error, result, response) {
		if (!error) {
			deferred.resolve(unwrapEntity(response.body));
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
};

dataAccess.delete = function (id) {
	var deferred = $q.defer();

	dataAccess.tableService.deleteEntity(TABLE_NAME, {
		PartitionKey: id.toString(),
		RowKey: id.toString()
	}, function (error, result, response) {
		if (!error) {
			deferred.resolve(result);
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
};

dataAccess.auto_increment = function () {
	var deferred = $q.defer();

	dataAccess.tableService.retrieveEntity("indexes", TABLE_NAME, TABLE_NAME, function (error, result, response) {
		if (!error) {
			var entity = unwrapEntity(response.body, false);
			entity.count = parseInt(entity.count);
			var count = entity.count;
			entity.count = entity.count + 1;
			dataAccess.tableService.replaceEntity("indexes", entity, function (error, result, response) {
				deferred.resolve(count);
			});
		} else {
			deferred.reject(error);
		}
	});

	return deferred.promise;
};

module.exports = function (table, q) {
	TABLE_NAME = table;
	$q = q;

	// initialisation
	dataAccess.tableService = azure.createTableService(ACCOUNT_NAME, ACCOUNT_KEY);
	dataAccess.tableService.createTableIfNotExists(TABLE_NAME, function (error, result, response) {
		if (!error) {
			// result contains true if created; false if already exists
		}
	});

	return dataAccess;
};