const validitions = {
  required: {
    isInvalid(value) {
      return !value;
    },
    message() {
      return 'This field is required.';
    },
  },
  alpha: {
    isInvalid(value) {
      return /[^a-zA-Z\s]/.test(value);
    },
    message() {
      return 'This field only accepts apha characters.';
    },
  },
  numeric: {
    isInvalid(value) {
      return /[^0-9]/.test(value);
    },
    message() {
      return 'This field only accepts numeric characters.';
    },
  },
  alphaNumeric: {
    isInvalid(value) {
      return (
        validitions.numeric.isInvalid(value) &&
        validitions.alpha.isInvalid(value)
      );
    },
    message() {
      return 'This field only accepts aphanumeric characters.';
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
    message(value, field, rule) {
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
    message(value, field, rule) {
      return `Please enter at least ${parseInt(
        rule.substr(3),
        10
      )} characters.`;
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
      return !phoneRegExp.test(value);
    },
    message() {
      return 'Please specify a valid phone number';
    },
  },
};

export default validitions;
