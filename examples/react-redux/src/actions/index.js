import Validator from 'basic-form-validator';
import { fieldRules, customValidations } from '../constants/validations';

const validator = new Validator(fieldRules, undefined, customValidations);

const changeField = (field, fields, errorMessages, hasBeenValidated) => {
  console.log(errorMessages, hasBeenValidated);
  return {
    type: 'CHANGE_VALUE',
    errorMessage: errorMessages.length > 0 ? errorMessages[0] : '',
    field,
    value: fields[field].value,
    isValid: errorMessages.length === 0,
    hasBeenValidated,
  };
};

export const validateField = (field, fields, hasBeenValidated) => {
  return dispatch => {
    if (!hasBeenValidated) {
      return dispatch(changeField(field, fields, [], hasBeenValidated));
    }
    return validator
      .validate(field, fields)
      .then(errorMessages =>
        dispatch(
          changeField(field, fields, errorMessages[field], hasBeenValidated)
        )
      );
  };
};

export const focusOnField = focusField => ({
  type: 'FOCUS_ON_FIELD',
  focusField,
});

const submitForm = () => ({ type: 'SUBMIT_FORM' });

export const validateAllFields = () => {
  return (dispatch, getState) => {
    const { fields } = getState();
    for (let field in fields) {
      const { value } = fields[field];
      dispatch(validateField(field, fields, true));
    }

    const { fields: afterFields } = getState();
    for (let field in afterFields) {
      if (afterFields[field].errorMessage) {
        return dispatch(focusOnField(field));
      }
    }

    return dispatch(submitForm());
  };
};
