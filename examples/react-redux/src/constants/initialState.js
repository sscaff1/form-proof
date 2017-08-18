import COUNTRIES from './countries';

const defaultField = {
  errorMessage: '',
  value: '',
  isValid: false,
  hasBeenValidated: false,
};

const fields = {
  firstName: defaultField,
  lastName: defaultField,
  address1: defaultField,
  address2: defaultField,
  city: defaultField,
  country: {
    ...defaultField,
    value: 'US',
    children: COUNTRIES,
  },
  zip: defaultField,
  phone: defaultField,
  email: defaultField,
};

const form = {
  focusField: 'firstName',
  formSubmitted: false,
};

export default {
  fields,
  form,
};
