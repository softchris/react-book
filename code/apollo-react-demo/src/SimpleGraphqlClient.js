import React, { Component } from 'react';

class SimpleGraphqlClient extends React.Component {
  state = {
    data: void 0,
    loading: false,
    error: void 0,
  };

  constructor(props) {
    super(props);
    this.fetch();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.query !== this.props.query) {
      this.fetch();
    }
  }

  async fetch() {
    this.setState({ loading: true });

    const body = `{ "query" : "${this.props.query.trim()}" }`;
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body,
      headers : {
        'content-type': 'application/json',
      },
    });
    if(response.status === 400) {
      this.setState({ error: response.statusText});
    } else {
      const data = await response.json();
      this.setState({data});
    }

    this.setState({ loading: false });
  }

  render() {
    const { data, loading, error } = this.state;

    if(loading) {
      return <div>loading...</div>;
    }
    else if(data) {
      return this.props.render(data);
    } else if(error) {
      return this.props.otherwise({error});
    }

    return null;
  }
}

export default SimpleGraphqlClient;
