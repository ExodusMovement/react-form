import React from 'react'
import Field from './field.jsx'
import LoadingSymbol from './loading-symbol.jsx'

class Form extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    this.state = {
      responses: {},

      childrenValidateActiveTrigger: 0,
      validationShowWarning: false,
      validationWarningText: '',
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(id, value, isValid, isSet) {
    const responses = this.state.responses

    responses[id] = {
      value,
      isValid,
      isSet,
    }

    this.setState({ responses, validationShowWarning: false })
  }

  onSubmit() {
    if (this.props.loading) {
      return
    }

    // show validate results on inputs
    this.setState({ childrenValidateActiveTrigger: this.state.childrenValidateActiveTrigger + 1 })

    const responses = this.state.responses
    for (const response of Object.values(responses)) {
      if (response.isValid === false) {
        this.setState({
          validationShowWarning: true,
          validationWarningText: 'Check that all questions were answered correctly',
        })
        return
      }
    }

    this.props.onSubmit(responses)
  }

  render() {
    const { fields, loading, showWarning, warningText } = this.props
    const {
      childrenValidateActiveTrigger,
      validationShowWarning,
      validationWarningText,
    } = this.state
    return (
      <div className="react-form-container">
        <form>
          {fields.map((item, index) => (
            <Field
              key={item.id}
              id={item.id}
              type={item.type}
              body={item.body}
              required={item.required}
              choices={item.choices}
              singleAnswer={item.single_answer}
              validate={item.validate}
              supportedFileTypes={item.supported_file_types}
              validateActiveTrigger={childrenValidateActiveTrigger}
              onChange={this.onChange}
            />
          ))}
        </form>
        <button
          className="react-form__button react-form-container__submit-button"
          onClick={this.onSubmit}
        >
          <span className="react-form__button-align">
            <span className="react-form__button-align-text">Submit</span>
          </span>
        </button>
        {loading && (
          <div className="react-form-container__loading-container">
            <LoadingSymbol />
          </div>
        )}
        {validationShowWarning && (
          <div
            className="react-form-container__validate-message"
            dangerouslySetInnerHTML={{ __html: validationWarningText }}
          />
        )}
        {showWarning && (
          <div
            className="react-form-container__validate-message"
            dangerouslySetInnerHTML={{ __html: warningText }}
          />
        )}
      </div>
    )
  }
}

export default Form
