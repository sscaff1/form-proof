export const fieldRules = {
  firstName: ['required', 'max30', 'restrictChars'],
  lastName: ['required', 'max30', 'restrictChars'],
  address1: ['required', 'max75', 'restrictChars'],
  address2: ['restrictChars', 'max75'],
  city: ['required', 'max30', 'restrictChars'],
  country: ['requiredSelect'],
  state: ['requiredSelect'],
  zip: ['required', 'zipCode', 'restrictChars'],
  phone: ['required', 'max20', 'phone', 'restrictChars'],
  email: ['required', 'email'],
};

const STANDARD_COUNTRIES = ['US', 'CA'];

export const customValidations = {
  zipCode: {
    validate(value, rule, fields) {
      if (STANDARD_COUNTRIES.includes(fields.country.value)) {
        return validations.max.validate(value, 'max10');
      }
      return false;
    },
    message() {
      return validations.max.message('max10');
    },
  },
};
