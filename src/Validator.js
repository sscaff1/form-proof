import Promise from 'promise-polyfill';
import validations from './validations';

if (!window.Promise) {
  // IE11 polyfill
  window.Promise = Promise;
}

export default class Validator {
  constructor(
    fieldRules,
    form,
    customValidations = {},
    additionalValidationParams = {}
  ) {
    let rules = validations;
    for (let rule in customValidations) {
      if (
        customValidations[rule].isInvalid &&
        customValidations[rule].message &&
        rule in validations
      ) {
        // overwrite a rule entirely
        rules = { ...rules, [rule]: customValidations[rule] };
      } else if (rule in validations) {
        // modify a part of an existing rule
        const modifiedRule = { ...rules[rule], ...customValidations[rule] };
        rules = { ...rules, [rule]: modifiedRule };
      } else {
        // otherwise just add to the object
        rules = { ...rules, [rule]: customValidations[rule] };
      }
    }
    this.form = form;
    this.fieldRules = fieldRules;
    this.validations = rules;
    this.additionalValidationParams = additionalValidationParams;
  }

  getRule(rule) {
    if (rule.indexOf('max') === 0) {
      return this.validations.max;
    } else if (rule.indexOf('min') === 0) {
      return this.validations.min;
    }
    return this.validations[rule];
  }

  getFormState() {
    const form = document.querySelector(this.form);
    return this.serializeForm(form);
  }

  serializeForm(form) {
    const fields = {};
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      fields[elements[i].name] = elements[i];
    }
    return fields;
  }

  validate(
    field,
    form = undefined,
    withFields = false,
    errorMessageKey = 'errorMessages'
  ) {
    const fields = form || this.getFormState();
    return new Promise(resolve => {
      const rules = this.fieldRules[field];
      const errors = [];
      rules.forEach(rule => {
        const validationArguments = [
          fields[field].value,
          field,
          rule,
          fields,
          this.additionalValidationParams,
        ];
        const error = this.getRule(rule);
        if (error.isInvalid(...validationArguments)) {
          errors.push(error.message(...validationArguments));
        }
      });
      if (withFields) {
        return resolve({
          ...fields,
          [field]: { value: fields[field].value, [errorMessageKey]: errors },
        });
      }
      return resolve({ [field]: errors });
    });
  }

  validateAll(form = undefined) {
    const fields = form || this.getFormState();
    const promises = [];
    for (let field in fields) {
      promises.push(this.validate(field, fields));
    }
    return Promise.all(promises).then(errors =>
      errors.reduce((obj, error) => ({ ...obj, ...error }), {})
    );
  }
}
