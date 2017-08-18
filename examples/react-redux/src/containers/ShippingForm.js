import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateField, validateAllFields, focusOnField } from '../actions';

class ShippingForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    onBlurChange: PropTypes.func.isRequired,
    focusField: PropTypes.string.isRequired,
    removeFocusField: PropTypes.func.isRequired,
    formSubmitted: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.focusOnField();
  }

  componentDidUpdate(prevProps) {
    this.focusOnField();
  }

  focusOnField() {
    if (this[this.props.focusField]) {
      this[this.props.focusField].focus();
      this.props.removeFocusField();
    }
  }

  getFieldProps(field) {
    const { onBlurChange, fields } = this.props;
    return {
      name: field,
      id: field,
      onChange(e) {
        onBlurChange(field, fields, fields[field].hasBeenValidated);
      },
      onBlur(e) {
        onBlurChange(field, fields, true);
      },
    };
  }

  renderSelectChildren(options) {
    const children = [];
    for (let key in options) {
      children.push(
        <option key={key} value={key}>
          {options[key]}
        </option>
      );
    }
    return children;
  }

  render() {
    const { fields, onBlurChange, validateFields, formSubmitted } = this.props;
    if (formSubmitted) {
      return <h1>Form Submitted</h1>;
    }
    return (
      <form>
        <div className="group">
          <Input
            inputRef={input => (this.firstName = input)}
            label="First Name"
            classContainer="group"
            {...this.getFieldProps('firstName')}
            {...fields.firstName}
          />
          <Input
            inputRef={input => (this.lastName = input)}
            label="Last Name"
            classContainer="group"
            {...this.getFieldProps('lastName')}
            {...fields.lastName}
          />
        </div>
        <Input
          label="Street Address"
          inputRef={input => (this.address1 = input)}
          {...this.getFieldProps('address1')}
          {...fields.address1}
        />
        <Input
          inputRef={input => (this.address2 = input)}
          label="Apartment/Suite/Other"
          placeholder="optional"
          {...this.getFieldProps('address2')}
          {...fields.address2}
        />
        <Input
          label="Country"
          inputRef={input => (this.country = input)}
          {...this.getFieldProps('country')}
          {...fields.country}
          isSelect
        >
          {this.renderSelectChildren(fields.country.children)}
        </Input>

        <Input
          label="City"
          inputRef={input => (this.city = input)}
          {...this.getFieldProps('city')}
          {...fields.city}
        />
        <Input
          label="Zip/Postal Code"
          inputRef={input => (this.zip = input)}
          {...this.getFieldProps('zip')}
          classContainer="small"
          {...fields.zip}
        />
        <Input
          label="Phone"
          inputRef={input => (this.phone = input)}
          {...this.getFieldProps('phone')}
          {...fields.phone}
        />
        <Input
          label="Email"
          inputRef={input => (this.email = input)}
          {...this.getFieldProps('email')}
          {...fields.email}
        />
        <div className="buttonWrapper">
          <Button onClick={validateFields} />
        </div>
        <style jsx>{`
          form {
            width: 342px;
          }
          .group {
            display: flex;
            justify-content: space-between;
          }
          a {
            color: #000;
            display: block;
            font-size: 12px;
            margin: 3px 0 13px;
            text-align: right;
          }
          .buttonWrapper {
            display: inline-block;
            margin: 20px 0 0;
          }
        `}</style>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return { fields: state.fields, ...state.form };
};

const mapDispatchToProps = dispatch => {
  return {
    onBlurChange(field, fields, hasBeenValidated) {
      dispatch(validateField(field, fields, hasBeenValidated));
    },
    validateFields() {
      dispatch(validateAllFields());
    },
    removeFocusField() {
      dispatch(focusOnField(''));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingForm);
