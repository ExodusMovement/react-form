import React from 'react'
import EmailValidator from 'email-validator'
import classNames from 'classnames'

class ShortTextInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue('')

    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const value = e.target.value.trim()

    this.props.onChange({
      value,
      isSet: value !== '',

      isValid: this.props.validate === 'email' ? EmailValidator.validate(value) : true,
      message: 'Please enter a valid email address',
    })
  }

  render() {
    return <input type="text" onChange={this.onChange} maxLength="128" />
  }
}

class FreeTextInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue('')

    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const value = e.target.value.trim()

    this.props.onChange({
      value,
      isSet: value !== '',
    })
  }

  render() {
    return <textarea rows="6" onChange={this.onChange} />
  }
}

class BooleanInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue(undefined)

    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onChange(e, data) {
    this.props.onChange({ value: data, isSet: true })
  }

  render() {
    const { id } = this.props
    return (
      <div>
        <div className="react-form-check react-form-check-inline">
          <input
            name={id}
            id={`${id}-1`}
            type="radio"
            className="react-form-check-input"
            onChange={(e) => {
              this.onChange(e, true)
            }}
          />
          <label htmlFor={`${id}-1`} className="react-form-check-label">
            Yes
          </label>
        </div>

        <div className="react-form-check react-form-check-inline">
          <input
            name={id}
            id={`${id}-2`}
            type="radio"
            className="react-form-check-input"
            onChange={(e) => {
              this.onChange(e, false)
            }}
          />
          <label htmlFor={`${id}-2`} className="react-form-check-label">
            No
          </label>
        </div>
      </div>
    )
  }
}

class DropdownInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue(props.choices ? [props.choices[0].id] : [])

    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const value = e.target.value

    const { choices } = this.props
    const firstOptionValue = choices && choices[0].id

    console.log(value)
    console.log(choices)
    console.log(firstOptionValue)

    this.props.onChange({ value: [value], isSet: value !== firstOptionValue })
  }

  render() {
    const { choices } = this.props
    return (
      <select as="select" onChange={this.onChange}>
        {choices.map((choice) => (
          <option key={choice.id} value={choice.id}>
            {choice.body}
          </option>
        ))}
      </select>
    )
  }
}

class MultipleChoiceInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue([])

    this.state = { value: [] }

    this.onChange = this.onChange.bind(this)
  }

  onChange(e, data) {
    let value
    if (this.props.singleAnswer) {
      value = [data.id]
    } else {
      value = this.state.value

      const checked = e.target.checked
      if (checked) {
        value.push(data.id)
      } else {
        value = value.filter((id) => id !== data.id)
      }
    }

    this.props.onChange({ value, isSet: value.length > 0 })
  }

  render() {
    const { id, choices, singleAnswer } = this.props
    return (
      <React.Fragment>
        {choices.map((choice, index) => (
          <div key={choice.id || index} className="react-form-check">
            {singleAnswer ? (
              <input
                id={choice.id}
                name={id}
                type="radio"
                className="react-form-check-input"
                onChange={(e) => {
                  this.onChange(e, choice)
                }}
              />
            ) : (
              <input
                id={choice.id}
                name={id}
                type="checkbox"
                className="react-form-check-input"
                onChange={(e) => {
                  this.onChange(e, choice)
                }}
              />
            )}
            <label htmlFor={choice.id} className="react-form-check-label">
              {choice.body}
            </label>
          </div>
        ))}
      </React.Fragment>
    )
  }
}

class DateInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue('')

    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    let value = e.target.value.trim()

    const date = new Date(value)
    if (isNaN(date.getDate())) {
      value = false
    } else {
      const addTrailingZero = (num) => {
        const str = num.toString()
        return str.length === 1 ? `0${str}` : str
      }
      value = `${date.getFullYear()}-${addTrailingZero(date.getMonth() + 1)}-${addTrailingZero(
        date.getDate()
      )}`
    }

    this.props.onChange({
      value,
      isSet: value !== '' && value !== false,

      isValid: value !== false,
      message: 'Please enter a date in the following format: yyyy-mm-dd',
    })
  }

  render() {
    return <input type="date" onChange={this.onChange} placeholder="yyyy-mm-dd" />
  }
}

class NumericInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue('')

    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    const value = parseFloat(e.target.value.trim())
    this.props.onChange({ value, isSet: value !== '' })
  }

  render() {
    return <input type="number" onChange={this.onChange} />
  }
}

function getFileData(e, done) {
  try {
    // base64 file data
    const file = e.nativeEvent.srcElement.files[0]
    const filename = e.target.value.split(/(\\|\/)/g).pop()
    const filetype = filename.split('.').pop().toLowerCase()

    const reader = new FileReader()
    reader.readAsBinaryString(file)

    reader.onload = () => {
      done({ name: filename, data: btoa(reader.result) }, filetype)
    }

    reader.onerror = function () {
      console.error('Error while encoding file data')
      done('')
    }
  } catch (err) {
    console.log(err)
    done('')
  }
}

class FileInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    props.setInitialValue('')

    this.fileInput = React.createRef()

    this.state = {
      filename: 'No file chosen',
    }

    this.onChange = this.onChange.bind(this)
    this.handleFileInputClicked = this.handleFileInputClicked.bind(this)
  }

  onChange(e) {
    const callback = (data, filetype) => {
      const obj = {
        value: data,
        isSet: data !== '',
      }

      if (!this.props.supportedFileTypes.includes(filetype)) {
        obj.isValid = false
        obj.message = 'This file type is not supported.'
      }

      this.props.onChange(obj)
      this.setState({ filename: data.name || 'No file chosen' })
    }
    getFileData(e, callback)
  }

  handleFileInputClicked() {
    this.fileInput.current.click()
  }

  render() {
    const { filename } = this.state
    return (
      <React.Fragment>
        <div className="react-form-field__file-input">
          <input type="file" ref={this.fileInput} onChange={this.onChange} />
          <span className="react-form-field__file-input-background react-form__button" />
          <span
            className="react-form-field__file-input-label react-form__button"
            onClick={this.handleFileInputClicked}
          >
            <span className="react-form__button-align">
              <span className="react-form__button-align-text">Choose File</span>
            </span>
          </span>
          <span className="react-form-field__file-input-filename">{filename}</span>
        </div>
      </React.Fragment>
    )
  }
}

class FormField extends React.PureComponent {
  constructor(props, context) {
    super(props, context)

    this.state = {
      value: undefined,
      isValid: !props.required || (props.type === 'multiple_choice' && !props.singleAnswer),

      message: 'This is required',
      validateActive: false,
    }

    this.setInitialValue = this.setInitialValue.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  setInitialValue(value) {
    this.setState({ value })

    const isSet = false

    this.props.onChange(this.props.id, value, this.state.isValid, isSet)
  }

  onChange({ value, isSet, isValid = true, message }) {
    if (this.props.required && !isSet) {
      isValid = false
      message = 'This is required'
    }

    this.setState({ value, isValid, message, validateActive: false })
    this.props.onChange(this.props.id, value, isValid, isSet)
  }

  componentDidUpdate(prevProps) {
    // check if validateActive was turned on
    if (prevProps.validateActiveTrigger !== this.props.validateActiveTrigger) {
      this.setState({ validateActive: true })
    }
  }

  render() {
    const { type, id, body, choices, singleAnswer, required, supportedFileTypes, validate } =
      this.props
    const { isValid, validateActive } = this.state

    let input
    switch (type) {
      case 'short_text':
        input = (
          <ShortTextInput
            validate={validate}
            setInitialValue={this.setInitialValue}
            onChange={this.onChange}
          />
        )
        break

      case 'free_text':
        input = <FreeTextInput setInitialValue={this.setInitialValue} onChange={this.onChange} />
        break

      case 'boolean':
        input = (
          <BooleanInput id={id} setInitialValue={this.setInitialValue} onChange={this.onChange} />
        )
        break

      case 'dropdown':
        input = (
          <DropdownInput
            choices={choices}
            setInitialValue={this.setInitialValue}
            onChange={this.onChange}
          />
        )
        break

      case 'multiple_choice':
        input = (
          <MultipleChoiceInput
            id={id}
            choices={choices}
            singleAnswer={singleAnswer}
            setInitialValue={this.setInitialValue}
            onChange={this.onChange}
          />
        )
        break

      case 'date':
        input = <DateInput setInitialValue={this.setInitialValue} onChange={this.onChange} />
        break

      case 'numeric':
        input = <NumericInput setInitialValue={this.setInitialValue} onChange={this.onChange} />
        break

      case 'file':
        input = (
          <FileInput
            supportedFileTypes={supportedFileTypes}
            setInitialValue={this.setInitialValue}
            onChange={this.onChange}
          />
        )
    }

    return (
      <div className={classNames('react-form-field', `react-form-field__type-${type}`)}>
        <label className="react-form-field__label">
          {body}{' '}
          {!required && <span className="react-form-field__label--optional">(optional)</span>}
        </label>
        {input}
        {validateActive && !isValid && (
          <div className="react-form-field__validate-message">{this.state.message}</div>
        )}
      </div>
    )
  }
}

export default FormField
