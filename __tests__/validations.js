import Validator from '../src';
import validations from '../src/validations';

const fieldRules = {
  required: ['required'],
  alpha: ['alpha'],
  numeric: ['numeric'],
  alphaNumeric: ['alphaNumeric'],
  requiredSelect: ['requiredSelect'],
  max: ['max5'],
  min: ['min3'],
  email: ['email'],
  phone: ['phone'],
};

document.body.innerHTML = `
  <form>
    <input type="text" name="required" value="" />
    <input type="text" name="alpha" value="123" />
    <input type="text" name="numeric" value="abc" />
    <input type="text" name="alphaNumeric" value="_" />
    <select name="requiredSelect">
      <option value="-1"></option>
    </select>
    <input type="text" name="max" value="abcdef" />
    <input type="text" name="min" value="ab" />
    <input type="text" name="email" value="notanemail" />
    <input type="text" name="phone" value="notaphone" />
  </form>
`;

describe('validations (built in)', () => {
  test('should be able to validate all fields', () => {
    const validator = new Validator(fieldRules, 'form');
    expect.assertions(1);
    const expectedObject = {};
    for (let field in fieldRules) {
      expectedObject[field] = [
        validations[field].message(undefined, undefined, fieldRules[field][0]),
      ];
    }
    return validator.validateAll().then(errors => {
      expect(errors).toEqual(expectedObject);
    });
  });
});
