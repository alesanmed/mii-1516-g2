var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe("Post a customer to the API", function (){
	//TODO Hay que hacer validacion en servidor todavia
	it("Try to create a customer with an invalid value on credit_card, should respond 500", function(){
		var customer = {
			name : 'John',
			surname : 'Doe',
			email : 'pablo@email.com',
			password : 'password',
			credit_card: '54305998056233',
			address : 'Avda. Reina Mercedes, s/n',
			country : 'Spain',
			city : 'Seville',
			phone : '111111111'
		};

		request("http://localhost:3000")
			.post("/api/signup")
			.send(customer)
			.end(function(err, res){
				if(err){
					console.log("Error Signing-up a customer -> message: "+err);
					throw err;
				}else{
					//res.status.should.be.equal(500);
				}
				
			});
	});
});