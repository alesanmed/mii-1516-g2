var db_utils = require('./db_utils'),
	Provide = require('../models/provide'),
	SupplierService = require('./services/service_suppliers'),
	ReputationService = require('./services/service_reputation'),
	ActorService = require('./services/service_actors')
	async = require('async');

// Devuelve una lista de Provides que tienen un producto con id
exports.getProvidesByProductId = function(req, res) {
	var _code = req.params.id;

	console.log('GET /api/providesByProductId/'+_code)
	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret')
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' | role=='supplier') {
			// Get product's provides
			Provide.find({product_id: _code, deleted: false },function (err,provides){
				if(err){
					console.log('---ERROR finding Provides with  product_id: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					var final_provides = [];
					// For each provide
					async.each(provides, function (provide, callback) {
						var provide_obj = provide.toObject();
						//Get and store the supplier name
						SupplierService.getName(provide.supplier_id, function (err, supplier) {
							if(err) {
								console.log(err);
								res.sendStatus(500);
							} else {
								provide_obj['supplierName'] = supplier.name;
								//Get and store the supplier average reputation
								ReputationService.averageReputation(supplier.id, function (err, results) {
									if(err){
										console.log(err);
										res.sendStatus(500);
									}

									provide_obj['reputation'] = Math.floor(results[0].avg);
									SupplierService.userHasPurchased(cookie, jwtKey, provide.id, function (hasPurchased) {
										provide_obj['userHasPurchased'] = hasPurchased;
										
										final_provides.push(provide_obj);
										callback();
									});
								});
							}
						});
					}, function (err) {
						if(err){
							console.log(err);
							res.sendStatus(500);
						}

						res.status(200).json(final_provides);
					});
				}
			});
		} else {
			res.sendStatus(401);
		}
	});
};

// 
exports.getProvide = function(req, res) {
	var _code = req.params.id;
	console.log('GET /api/provide/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			Provide.findById( _code,function(err,provide){
				if(err){
					console.log('---ERROR finding Provide: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(provide);
					res.status(200).json(provide);
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesn't have permission"});
		}
	});
};

exports.getExistingProvide = function(req, res) {
	var _code = req.params.id;
	onsole.log('GET /api/existingProvide/'+_code)

	var cookie = req.cookies.session;
	var jwtKey = req.app.get('superSecret');
	// Check authenticated
	ActorService.getUserRole(cookie, jwtKey, function (role) {
		if (role=='admin' || role=='customer' || role=='supplier') {
			Provide.findOne( {_id : _code, deleted : false },function(err,provide){
				if(err || !provide){
					console.log('---ERROR finding Provide: '+_code+' message: '+err);
					res.status(500).json({success: false, message: err});
				}else{
					//console.log(provide);
					res.status(200).json(provide);
				}
			});
		} else {
			res.status(403).json({success: false, message: "Doesn't have permission"});
		}
	});
}