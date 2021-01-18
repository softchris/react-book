import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InnerInput = styled.input`
  font-size: 20px;
`;

const InputContainer = styled.div`
  padding: 20px;
  border: solid 1px grey;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  border: red;
  background: pink;
  color: white;
`;

const validate = (val, errMessage) => {
  const valid = /^[0-9]{2,3}$/.test(val);
  return valid ? '' : errMessage;
};

class Input extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    notify: PropTypes.func,
    desc: PropTypes.string,
    errMessage: PropTypes.string,
  };

  state = {
    error: '',
    data: '',
  }

  handleChange = (ev) => {
    const { errMessage, name, notify } = this.props;

    const error = validate(ev.target.value, errMessage);
    notify(name, error === '');
    this.setState({
      data: ev.target.value,
      error,
    });
  }

  render() {
    return (
      <InputContainer>
        {this.state.error &&
          <ErrorMessage>{this.state.error}</ErrorMessage>
        }
        <div>
          {this.props.desc}
        </div>
        <InnerInput value={this.state.data} onChange={this.handleChange} {...this.props} />
      </InputContainer>
    );
  }
}

export default Input;
