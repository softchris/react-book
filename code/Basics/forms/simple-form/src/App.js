import React, { Component } from 'react';
import './App.css';
import Form from './Form';


class App extends Component {
  state = {
    firstname: void 0,
    lastname: void 0,
    products: ['tomato', 'cucumber', 'onion'],
    product: 'onion',
    form: {},
  }

  onSubmit = (ev) => {
    console.log('form', ev.target);
    return false;
  }

  handleChange = (ev) => {
    const value = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;

    this.setState({
      [ev.target.name]: value,
    });
  }


  render() {
    console.log('red selected', this.state.red);

    return (
      <div className="App">
        <Form />

        <form onSubmit={this.onSubmit}>
          <div>
            <label>First name</label>
            <input name="firstname" id="firstname" value={this.state.firstname} onChange={this.handleChange} />
            {this.state.firstname}
          </div>
          <div>
            <label>Last name</label>
            <input name="lastname" id="lastname" value={this.state.lastname} onChange={this.handleChange} />
            {this.state.lastname}
          </div>
          <div>
            Man <input type="radio" name="gender" value="man" onChange={this.handleChange} />
            Woman <input type="radio" name="gender" value="woman" onChange={this.handleChange} />
          </div>
          <div>
            Value selected: {this.state.gender}
          </div>
          <div>
            Yellow <input type="checkbox" name="yellow" id="yellow" value={this.state.yellow} onChange={this.handleChange} />
          </div>
          <div>
            Blue <input type="checkbox" name="blue" id="blue" value={this.state.yellow} onChange={this.handleChange} />
          </div>
          <div>
            Red <input type="checkbox" name="red" id="red" value={this.state.yellow} onChange={this.handleChange} />
          </div>
          <div>
            Selected colors:
            {this.state.yellow &&
            <span>Yellow selected </span>
            }
            {this.state.red &&
            <span>Red selected </span>
            }
            {this.state.blue &&
            <span>Blue selected </span>
            }
          </div>
          {this.state.products.length > 0 &&
            <select name="product" onChange={this.handleChange}>
              {this.state.products.map(p => <option selected={this.state.product === p} value={p}>{p}</option>)}
            </select>
          }
          Selected product: {this.state.product}
          <div>
            <button>Save</button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
