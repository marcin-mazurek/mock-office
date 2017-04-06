import React from 'react';
import classnames from 'classnames';

export class EditableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      value: props.value
    };
    this.setInputRef = this.setInputRef.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.handleKeys = this.handleKeys.bind(this);
    this.inputRef = null;
  }

  setInputRef(ref) {
    this.inputRef = ref;
    if (this.inputRef) {
      this.inputRef.focus();
    }
  }

  startEdit(e) {
    this.setState({
      edit: true
    });
    e.preventDefault();
    return false;
  }

  updateValue(e) {
    this.setState({
      value: e.currentTarget.value
    });
    this.props.onChange(e.currentTarget.value);
  }

  cancelEdit(e) {
    this.setState({
      value: this.props.value
    });
    this.setState({
      edit: false
    });
    this.props.onCancel(this.state.value);
    e.preventDefault();
    return false;
  }

  saveChanges(e) {
    this.setState({
      edit: false
    });
    this.props.onSave(this.state.value);
    e.preventDefault();
    return false;
  }

  handleKeys(e) {
    switch (e.keyCode) {
      case 13: { // Enter
        this.saveChanges(e);
        break;
      }
      case 27: { // Esc
        this.cancelEdit(e);
        break;
      }
      default: {
        break;
      }
    }
  }

  render() {
    const { edit, value } = this.state;

    const containerClass = classnames('editable-field', {
      'editable-field--edited': edit,
    });

    return (
      <span className={containerClass}>
        {
          edit ? (
            <input
              className="editable-field__input"
              type="text"
              value={value}
              onChange={this.updateValue}
              onKeyUp={this.handleKeys}
              ref={this.setInputRef}
            />
          ) : null
        }
        <a
          href=""
          className="editable-field__preview"
          onClick={this.startEdit}
        >
          {value || ' '}
        </a>
        {
          edit ? (
            <span className="editable-field__icons">
              <a href="" onClick={this.saveChanges} className="editable-field__icon">
                <i className="fa fa-check" />
              </a>
              <a href="" onClick={this.cancelEdit} className="editable-field__icon">
                <i className="fa fa-close" />
              </a>
            </span>
          ) : null
        }
      </span>
    );
  }
}

EditableField.propTypes = {
  value: React.PropTypes.node,
  onChange: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func.isRequired,
};

EditableField.defaultProps = {
  onChange: () => {
  },
  onCancel: () => {
  }
};

export default EditableField;
