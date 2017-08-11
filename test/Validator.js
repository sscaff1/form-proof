import assert from 'assert';
import Validator from '../src';

// representation of what we want our validations to look like
const fieldRules = {
  name: ['required'],
  address: ['required'],
};
// representation of a form
const fields = {
  name: {
    value: 'john',
  },
  address: {
    value: 'my street',
  },
};

describe('Validator', () => {
  it('should correctly instantiate the class', () => {
    const validator = new Validator(fieldRules, fields);
    assert.deepEqual(validator.fieldRules, fieldRules);
  });
  it('generates a basic error', done => {
    const validator = new Validator(fieldRules, {...fields, name:{ value: ''} });
    validator
      .validate('name')
      .then(error => {
        describe('for a basic error', () => {
          it('the field has 1 error', () => {
            assert.strictEqual(error.name.length, 1);
          });
          it('the message is correct', () => {
            assert.strictEqual(
              validator.validations.required.message(),
              error.name[0]
            );
          });
        });
        done();
      })
      .catch(done);
  });
  it('generates a min/max error', done => {
    const validator = new Validator({...fieldRules, name: ['required', 'max3']}, fields);
    validator
      .validate('name')
      .then(error => {
        describe('for a min/max error', () => {
          it('the field has 1 error', () => {
            assert.strictEqual(error.name.length, 1);
          });
          it('the message is correct', () => {
            assert.strictEqual(
              validator.validations.max.message('max3'),
              error.name[0]
            );
          });
        });
        done();
      })
      .catch(done);
  });
  it('can validate the entire form', (done) => {
    const newFields = { ...fields, email: { value: 'incorrectemail' } };
    const newRules = { ...fieldRules, email: ['email'] };
    const validator = new Validator(newRules, newFields);
    validator.validateAll()
      .then(errors => {
        console.log(errors);
        done();
      })
      .catch(done);
  });
});
