import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import SimpleGraphqlClient from './SimpleGraphqlClient';

const JediContainer = styled.div`
  border: solid 1px black;
  box-shadow: 0px 0px 10px 5px lightgray;
  margin: 10px;
  padding: 10px;
`;

const JediTitle = styled.h2`
  margin: 0;
`;

const GET_MOVIES = gql`
  query films {
    allFilms {
      films {
        title, id
      },
      totalCount
    }
  }
`
const jediId = "cGVvcGxlOjE=";

const GetJediQuery = gql`
{
  query getJedi {
    person(id: $id) {
      name,
      gender,
      skinColor,
      filmConnection {
        films {
          title,
          releaseDate
        }
      }
    }
  }
 }
`;


console.log("gql query", GetJediQuery);

const GET_JEDI = gql`
{
  person(id: "cGVvcGxlOjE=") {
   name,
   gender,
   skinColor,
   filmConnection {
     films {
       title,
       releaseDate
     }
   }
  }
 }
`

const MovieContainer = styled.div`
 padding: 10px;
 margin-bottom: 10px;
 border-radius: 5px;
 border: solid 1px #f2f2f2;
`;

const Movie = ({ movie : { title } }) => (
  <MovieContainer>{title}</MovieContainer>
);

const Jedi = ({jedi: { name, gender, skinColor, filmConnection: { films } } }) => (
  <JediContainer>
    <JediTitle>{name} </JediTitle>
    <div>{gender} {skinColor}</div>
    <h3>Appears in the following movies</h3>
    {films.map(film => <Movie key={film.title} movie={film} />)}
  </JediContainer>
);

// add query, maybe caching and polling, pagination??
// maybe a set up function for setting base url

const query = `
  { humans }
`;

const App = () => (
  <React.Fragment>
    <SimpleGraphqlClient
      query={query}
      render={({ data: { humans } }) => (
        <div>{humans.map(human => <div>{human}</div>)}</div>
      )}
      otherwise={({error}) => (
        <div>{error}</div>
      )}
    />

    <Query query={GET_MOVIES}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;

        const { allFilms: { films } } = data;
        const elems = films.map(film => <Movie key={film.title} movie={film} />);
        console.log(films);

        return (
          <div>Films: {elems}</div>
        )
      }}
    </Query>
    <Query query={GET_JEDI}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error :(</div>;

        const { person } = data;
        return (
          <Jedi jedi={person} />
        )
      }}
    </Query>
  </React.Fragment>
)

export default App;

