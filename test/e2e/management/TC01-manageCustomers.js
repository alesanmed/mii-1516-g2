function stringGen(len) {
	var text = " ";
	var charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
	for( var i=0; i < len; i++ )
		text += charset.charAt(Math.floor(Math.random() * charset.length));
	return text;
}

describe('System\'s customers management view', function () {
	
	beforeEach(function() {
		browser.get('http://localhost:3000/');
		element(by.css('[ng-click="signout()"]')).isPresent().then(function (result) {
			if(result) {
				element(by.css('[ng-click="signout()"]')).click()
			}
		});
	});

	it('should load the customers', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		element(by.id('customers-length')).getText().then (function (text) {
			var number_customers = parseInt(text);
			expect(number_customers).toBeGreaterThan(0);
		});
	});

	it('should edit a customer with a new value', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		// Only works with a different value each time.
		// Edition redjects same-value uploads
		var new_value = stringGen(10).trim();
		
		// Click on first edit button
		var editBtn = element.all(by.css('.btn-edit-customers')).first();
		editBtn.click();
		// Edit first phone input
		var phoneInput = element.all(by.model('customer.phone')).first();
		phoneInput.clear();
		phoneInput.sendKeys(new_value);
		// Click on first save button
		var saveBtn = element.all(by.css('button.btn-save-customers')).first();
		
		saveBtn.click().then(function() {
			// New value should be expected
			browser.driver.sleep(1);
			browser.waitForAngular();
			element.all(by.css('.customer-phone')).get(0).getText().then(function (text) {
				expect(new_value).toEqual(text)
			});
		}); 

	});

	it('should cancel edition and fields should revert', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();

		browser.get('http://localhost:3000/customers');

		// Click on first edit button
		var editBtn = element.all(by.css('.btn-edit-customers')).first();
		editBtn.click();
		// get first phone input
		var phoneInput = element.all(by.model('customer.phone')).first();
		var old_value
		phoneInput.getAttribute('value').then(function (value) {
			old_value = value;
		});
		
		// Click on first cancel button
		var cancelBtn = element.all(by.css('button.btn-cancel-customers')).first();

		cancelBtn.click().then(function() {
			// Old value should be expected
			browser.driver.sleep(1);
			browser.waitForAngular();
			element.all(by.css('.customer-phone')).get(0).getText().then(function (text) {
				expect(old_value).toEqual(text)
			});
		}); 
	});

	it('should remove a customers', function (){
		browser.get('http://localhost:3000/signin');

		element(by.model('email')).sendKeys('admin@mail.com');
		element(by.model('password')).sendKeys('administrator');

		element(by.css('.button')).click();
		
		browser.get('http://localhost:3000/customers');

		element(by.id('customers-length')).getText().then (function (text) {
			var number_customers = parseInt(text);
			
			// Click on first delete button
			var deleteBtn = element.all(by.css('.btn-delete-customers')).first();
			deleteBtn.click().then(function() {
				browser.waitForAngular();
				var confirmBtn = element.all(by.css('.btn-confirm-customers')).first();

				browser.wait(function() {
					return confirmBtn.isPresent();
				}, 30000);

				confirmBtn.click().then(function () {
					browser.waitForAngular();
					browser.sleep(500)
					element(by.id('customers-length')).getText().then (function (text) {
						expect(parseInt(text)).toEqual(number_customers - 1);
					});
				});
				
			}); 
		});
	});
});