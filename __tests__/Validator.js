import Validator from '../src';
import validations from '../src/validations';

const fillForm = (
  name = 'steven',
  email = 'sscaff1@gmail.com',
  type = 'text'
) => {
  document.body.innerHTML = `
    <form>
      <input type="${type}" name="name" value="${name}" />
      <input type="text" name="email" value="${email}" />
    </form>
  `;
  return document.querySelector('form');
};

const fieldRules = {
  name: ['required', 'min3'],
  email: ['required', 'email'],
};

describe('Validator', () => {
  const validator = new Validator(fieldRules, 'form');
  test('should be an instance of the Validator class', () => {
    return expect(validator).toBeInstanceOf(Validator);
  });
  test('should validate a field', () => {
    fillForm();
    expect.assertions(1);
    return validator
      .validate('name')
      .then(error => expect(error).toEqual({ name: [] }));
  });

  test('should validate a field with an error', () => {
    fillForm(undefined, 'sscaff1');
    expect.assertions(1);
    return validator.validate('email').then(error =>
      expect(error).toEqual({
        email: [validations.email.message()],
      })
    );
  });

  test('should validate all fields', () => {
    fillForm(undefined, '');
    expect.assertions(1);
    return validator.validateAll().then(error => {
      // notice order matters in the errors array
      expect(error).toEqual({
        name: [],
        email: [validations.required.message(), validations.email.message()],
      });
    });
  });

  test('should validate with original snapshot of fields', () => {
    const form = fillForm('');
    expect.assertions(1);
    return validator.validate('name', undefined, true).then(error => {
      expect(error).toEqual({
        ...validator.serializeForm(form),
        name: {
          value: '',
          errorMessages: [
            validations.required.message(),
            validations.min.message('min3'),
          ],
        },
      });
    });
  });

  test('should be able to modify a rule', () => {
    const newMessage = 'You did not specify a value';
    const customValidations = {
      required: {
        message() {
          return newMessage;
        },
      },
    };
    const validator2 = new Validator(fieldRules, 'form', customValidations);
    return expect(validator2.validations.required.message()).toBe(newMessage);
  });

  test('should be able to add a rule', () => {
    const message = 'This field is not a number';
    const customValidations = {
      isNumber: {
        isInvalid(value) {
          return (
            typeof parseFloat(value) !== 'number' || isNaN(parseFloat(value))
          );
        },
        message() {
          return message;
        },
      },
    };
    const validator2 = new Validator(
      { ...fieldRules, name: [...fieldRules.name, 'isNumber'] },
      'form',
      customValidations
    );
    expect.assertions(2);
    expect(validator2.validations.isNumber).toEqual(customValidations.isNumber);
    fillForm();
    return validator2.validate('name').then(error => {
      expect(error).toEqual({ name: [message] });
    });
  });

  test('should be able to overwite a rule', () => {
    const message = 'This field has no character length.';
    const customValidations = {
      required: {
        isInvalid(value) {
          return value.length === 0;
        },
        message() {
          return message;
        },
      },
    };
    const validator2 = new Validator(
      { ...fieldRules, name: ['required'] },
      'form',
      customValidations
    );
    fillForm('');
    expect.assertions(2);
    expect(validator2.validations.required).toEqual(customValidations.required);
    return validator2.validate('name').then(error => {
      expect(error).toEqual({ name: [message] });
    });
  });

  test('should be able to test min rule', () => {
    fillForm('st');
    expect.assertions(1);
    return validator.validate('name').then(error => {
      expect(error).toEqual({
        name: [validator.validations.min.message('min3')],
      });
    });
  });

  test('should be able to test max rule', () => {
    const validator2 = new Validator(
      {
        ...fieldRules,
        email: ['max5'],
      },
      'form'
    );
    expect.assertions(1);
    return validator2.validate('email').then(error => {
      expect(error).toEqual({
        email: [validator2.validations.max.message('max5')],
      });
    });
  });
});
