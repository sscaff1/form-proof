import assert from 'assert';
import Validator from '../src';

// representation of what we want our validations to look like
let fieldRules = {
  firstName: ['required'],
  address: ['required'],
};
// representation of a form
let fields = {
  firstName: {
    value: 'john',
  },
  address: {
    value: 'my street',
  },
};

describe('Validator', () => {
  it('should return a class with two methods', () => {
    const validator = new Validator(fieldRules, fields);
    assert.deepEqual(validator.fieldRules, fieldRules);
  });
  it('generates an error', done => {
    fields.firstName.value = '';
    const validator = new Validator(fieldRules, fields);
    validator
      .validate('firstName')
      .then(error => {
        describe('another error', () => {
          it('the field has 1 error', () => {
            assert.deepEqual(error.firstName.length, 1);
          });
          it('the message is correct', () => {
            assert.deepEqual(
              validator.validations.required.message(),
              error.firstName[0]
            );
          });
        });

        done();
      })
      .catch(done);
  });
});
