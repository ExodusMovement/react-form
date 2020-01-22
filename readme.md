## Form Component

### [Live Demo](https://www.exodus.io/job-application/?id=9039189C56&title=Test%20Job%20Post)

A simple React form component to gather data from users.

The component takes a `fields` prop and generates a form interface. When the user clicks the "Submit" button, the `onSubmit` callback is called with a responses object.

Server requests are not within the scope of this componenet; you can do whatever you like with the data that is returned.

There are a few extra features like validation for required fields, all detailed below.

The component comes with a set of default styles, which you can override if you like.

If you have a feature request, please open an issue and we'll get to it asap.

## Installation

```
yarn add @exodus/react-form
```

## Input Types

The [live demo](https://www.exodus.io/job-application/?id=9039189C56&title=Test%20Job%20Post) demonstrates all supported input types:

- `short_text`: Simple text input.
- `free_text`: Paragraph input.
- `boolean`: Displays two radio inputs with "Yes" & "No" labels.
- `dropdown`: This will always have `isSet` as `true`, since the first of the `choices` will be selected by default.
- `multiple_choice`: If `single_answer` is set to true, it displays the options as radio inputs, if not then as checkboxes.
- `date`: Returns a date in the format yyyy-mm-dd
- `numeric`: Accepts float as well as int values.
- `file`: Provide an array of accepted file types when using this type.

## Example Usage

The following is a complete example which includes:

- A sample array passed as the `fields` prop, showing what data to include for each input type. For example, the `file` type expects a `supported_file_types` array.

- Usage of the `loading` prop: The "Submit" button is deactivated when set to true. (optional)

- Usage of `showWarning` and `warningText` props: Shows warning text beneath the "Submit" button. (optional)

- Beneath the code example, there is a sample responses object. This is what you can expect the `onSubmit` callback to receive.

```javascript
import React from 'react'
import ReactForm from '@exodus/react-form'

// Example fields data
const fields = [
  {
    body: 'Full name', // Question text
    type: 'short_text',
    required: true,
    id: '22e55a',
  },
  {
    body: 'Email',
    type: 'short_text',
    required: true,
    validate: 'email',
    id: '22e55e',
  },
  {
    body: 'Summary',
    type: 'free_text',
    required: false,
    id: '22e55f',
  },
  {
    id: '22e55g',
    type: 'file',
    body: 'Resume',
    supported_file_types: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    required: false,
  },
  {
    body: 'Test Yes/No',
    type: 'boolean',
    required: true,
    id: '22e560',
  },
  {
    body: 'Test Dropdown',
    type: 'dropdown',
    required: true,
    choices: [
      { body: 'choice 1', id: '107f36' },
      { body: 'choice2', id: '107f37' },
    ],
    id: '22e561',
  },
  {
    body: 'Test Multiple choice',
    type: 'multiple_choice',
    required: true,
    choices: [
      { body: 'choice 1', id: '107f38' },
      { body: 'choice 2', id: '107f39' },
    ],
    id: '22e562',
  },
  {
    body: 'Test Multiple choice (single answer)',
    type: 'multiple_choice',
    required: true,
    single_answer: true,
    choices: [
      { body: 'choice 1', id: '107f3a' },
      { body: 'choice 2', id: '107f3b' },
    ],
    id: '22e563',
  },
  {
    body: 'Test Date',
    type: 'date',
    required: true,
    id: '22e564',
  },
  {
    body: 'Test Number',
    type: 'numeric',
    required: true,
    id: '22e565',
  },
]

class MyPage extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      requestPending: false,
      showWarning: false,
      warningText: '',
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(responses) {
    // do whatever, such as parse the response and send to a server

    this.setState({
      requestPending: true,
    })

    fetch(`/submit-form`, {
      method: 'post',
      body: JSON.stringify({ shortcode: '1234', data: responses }),
    })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = '/job-application-submitted'
        }
      })
      .catch((err) => {
        console.log(err)

        this.setState({
          requestPending: false,
          showWarning: true,
          warningText: 'There was an error and the application was not submitted!',
        })
      })
  }

  render() {
    const { requestPending, showWarning, warningText } = this.state
    return (
      <ReactForm
        fields={fields}
        loading={requestPending}
        showWarning={showWarning}
        warningText={warningText}
        onSubmit={this.onSubmit}
      />
    )
  }
}

export default MyPage
```

Example responses object passed to the `onSubmit` callback as its first parameter. The object keys are the `id`s that were passed to the component with the `fields` prop. For required fields, `isSet` will always be true.

```javascript
{
  // short_text
  '22e55a': { value: 'Barty Crouch', isValid: true, isSet: true },

  // short_text (validate: 'email')
  '22e55e': { value: 'barty@gmail.com', isValid: true, isSet: true },

  // free_text (required: false)
  '22e55f': { value: '', isValid: true, isSet: false },

  // file
  '22e55g': { value: { name: 'file.txt', data: 'alskdfj;ak' }, isValid: true, isSet: true },

  // boolean
  '22e560': { value: false, isValid: true, isSet: true },

  // dropdown
  '22e561': { value: ['107f36'], isValid: true, isSet: true },

  // multiple_choice
  '22e562': { value: ['107f38', '107f39'], isValid: true, isSet: true },

  // multiple_choice (single_answer: true)
  '22e563': { value: ['107f3a'], isValid: true, isSet: true },

  // date
  '22e564': { value: '2020-01-24', isValid: true, isSet: true },

  // numeric
  '22e565': { value: 123, isValid: true, isSet: true },
}
```
