var util = require('util'),
    Validator = require('node-validation').Validator;

//
// Definition of validation rules
//
var MyObjectValidator = function() {
	Validator.call(this);

	this.ruleFor('stringProperty').isNotEmpty();
	this.ruleFor('otherStringProperty').hasMaximumLength(10);

	this.ruleFor('numericStringProperty').isNumber().withMessage('Oops, something is wrong ...');
	this.ruleFor('dateStringProperty').matches(/^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/);

	this.ruleFor('numberProperty').isInteger();
	this.ruleFor('otherNumberProperty').isMaximum(5);

	this.ruleFor('exoticProperty').is(function(value) {
		return 3 === value.propertyA + value.propertyB;
	}).withMessage('Either propertyA or propertyB has an incorrect value.');
};

util.inherits(MyObjectValidator, Validator);

//
// Validation subject
//
var subject = {
	stringProperty: '',
	otherStringProperty: 'Some string value that is too long ...',

	numericStringProperty: '65.85 invalid',
	dateStringProperty: '2013-04-30 invalid',

	numberProperty: 'Some invalid number',
	otherNumberProperty: 48,

	exoticProperty: {
		propertyA: 1,
		propertyB: 1
	}
};

//
// Now it's time to validate
//
var validator = new MyObjectValidator();
var validationErrors = validator.validate(subject);

for(var i=0; i < validationErrors.length; i++) {
	console.log('Property name: ' + validationErrors[i].propertyName + ', Message: ' + validationErrors[i].message);
}