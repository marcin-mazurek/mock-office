import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Field } from 'redux-form/immutable';
import plusIcon from '../../../../../assets/icons_white_add.svg';

const ServerTypeField = field =>
  <Select
    name="server-type"
    value={field.input.value}
    onChange={option => field.input.onChange(option.value)}
    searchable={false}
    clearable={false}
    className="form-field__select"
    options={[
      { value: 'http', label: 'HTTP' },
      { value: 'ws', label: 'Web Socket' }
    ]}
  />;

const AddServerForm = ({ handleSubmit }) =>
  <form className="form add-server-form" onSubmit={handleSubmit}>
    <div className="form-row">
      <div className="form__field">
        <label className="form-field__label" htmlFor="name">
          Name:
        </label>
        <Field
          component="input"
          type="text"
          className="form-field__input"
          name="name"
          placeholder={'Awesome server'}
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form__col">
        <div className="form__field">
          <label className="form-field__label" htmlFor="port">
            Port:
          </label>
          <Field
            component="input"
            className="form-field__input"
            name="port"
            type="number"
          />
        </div>
      </div>
      <div className="form__col">
        <div className="form__field">
          <label className="form-field__label" htmlFor="type">
            Type:
          </label>
          <Field component={ServerTypeField} name="type" />
        </div>
      </div>
    </div>
    <div className="form-row">
      <button
        className="button form__button"
        type="submit"
      >
        <img className="form__submit-icon" src={plusIcon} alt="" />Create
      </button>
    </div>
  </form>;

AddServerForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default AddServerForm;
