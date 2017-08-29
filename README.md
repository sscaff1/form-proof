# Form Proof
[![Build Status](https://travis-ci.org/sscaff1/form-proof.svg?branch=master)](https://travis-ci.org/sscaff1/form-proof) [![codecov](https://codecov.io/gh/sscaff1/form-proof/branch/master/graph/badge.svg)](https://codecov.io/gh/sscaff1/form-proof)

## Purpose
Form validation shouldn't have to be a bloated library with tons of dependencies. At the the end of the day, it's not that hard. This small, extendable package attempts to demonstrate that. This library is **<2kbs** gzipped making it very light weight. The library is meant for forms, but is isomorphic by nature making it great for a wide variety of use cases. Help and suggestions are always welcome.

## Dependencies
Form pure has one dependency, a small Promise polyfill for IE browsers (**<1kb gzipped**).

## Usage
Install the package:

```
yarn add form-proof
```

or

```
npm i --save form-proof
```

Then use it:

```html
<!-- In the body of my page -->
<form>
  <input type="text" name="name" value="steven" />
  <input type="text" name="email" value="notanemail" />
</form>
```

```js
import Validator from 'form-proof';

/***
* The field rules is an object with its keys corresponding to the names of our form inputs
* each key has an array of validations that you would like to perform against the input.
***/
const fieldRules = {
  name: ['required', 'min3', 'max20'],
  email: ['required', 'email', 'max30']
};

// then initiate our validator. Our second argument is either undefined or can be the selector for our form.
const validator = new Validator(fieldRules, 'form');

// we can validate a single field. Our second argument 
validator.validate('name').then(error => console.log(error)) // { name: [] }

// we can validate the entire form
validator.validateAll().then(errors => console.log(errors)) // { name: [], email: ['You must provide a valid email address.'] };
```

## API
### Validator
| Argument | Type | Description |
| :---: | :---: | :------: |
| fieldRules | object (required) | An object where the keys correspond to the input names and the values are an array of validations for that field |
| form | string (optional) | The DOM selector for our form |
| customValidations | object (optional) | Additional validations |
| additionalValidationParams | object (optional) | Additional validation parameters that will be passed to the validator |

### Additional Validations
An object with keys indicating the name of the validation. Each key should be an object with two methods:
* isInvalid - a method that returns true when the validation is invalid and false otherwise
* message - a method that returns a string with the validation message

The validations can override methods as well if they have the same as an existing validation.

Example:

```js
const additionalValidations = {
  // this overrides the default required rule
  required: {
    isInvalid(value, field, rule, additionalValidationParams) {
      return value.length === 0;
    },
    message(value, field, rule, additionalValidationParams) {
      return 'This field value has no length';
    }
  },
  // this is a new rule
  isDivisibleBy3: {
    isInvalid(value, field, rule, additionalValidationParams) {
      return parseInt(value, 10) % 3 !== 0;
    },
    message(value, field, rule, additionalValidationParams) {
      return 'This field is not divisible by 3';
    }
  }
}
```
