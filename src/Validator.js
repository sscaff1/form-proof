import validations from './validations';

export default class Validator {
  constructor(
    form,
    fieldRules,
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
      fields[elements[i].name] = elements[i].value;
    }
    return fields;
  }

  validate(
    field,
    form = undefined,
    withFields = false,
    valueKey = 'value',
    errorMessageKey = 'errorMessages'
  ) {
    const fields = form || this.getFormState();
    return new Promise(resolve => {
      const rules = this.fieldRules[field];
      const errors = [];
      rules.forEach(rule => {
        const error = this.getRule(rule);
        if (
          error.isInvalid(
            fields[field],
            rule,
            fields,
            this.additionalValidationParams
          )
        ) {
          errors.push(error.message(rule));
        }
      });
      if (withFields) {
        return resolve({
          ...fields,
          [field]: { [valueKey]: fields[field], [errorMessageKey]: errors },
        });
      }
      return resolve({ [field]: errors });
    });
  }

  validateAll(withFields = false, errorMessageKey = 'errorMessages') {
    const fields = this.getFormState();
    const promises = [];
    for (let field in fields) {
      promises.push(this.validate(field, fields));
    }
    return Promise.all(promises).then(errors =>
      errors.reduce((obj, error) => ({ ...obj, ...error }), {})
    );
  }
}
