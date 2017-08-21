export default {
  required: {
    isInvalid(value) {
      return !value;
    },
    message() {
      return 'This field is required.';
    },
  },
  requiredSelect: {
    isInvalid(value) {
      return value === '-1';
    },
    message() {
      return 'Please make a selection';
    },
  },
  max: {
    isInvalid(value, field, rule) {
      const maxChars = parseInt(rule.substr(3), 10);
      return value.length > maxChars;
    },
    message(rule) {
      return `Please enter no more than ${parseInt(
        rule.substr(3),
        10
      )} characters.`;
    },
  },
  min: {
    isInvalid(value, field, rule) {
      const maxChars = parseInt(rule.substr(3), 10);
      return value.length < maxChars;
    },
    message(rule) {
      return `Please enter at least ${parseInt(
        rule.substr(3),
        10
      )} characters.`;
    },
  },
  restrictChars: {
    isInvalid(value) {
      return /[<>]/.test(value);
    },
    message() {
      return 'This field does not accept the < or > characters';
    },
  },
  email: {
    isInvalid(value) {
      const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
      return !emailRegExp.test(value);
    },
    message() {
      return 'Please enter a valid email address.';
    },
  },
  phone: {
    isInvalid(value) {
      const phoneRegExp = /^[\(\)\-\+\d]*$/;
      return !phoneRegExp.test(value) || value.length < 10;
    },
    message() {
      return 'Please specify a valid phone number';
    },
  },
};
