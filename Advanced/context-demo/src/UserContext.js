import React from 'react';

const UserContext = React.createContext({
  user: 'default user',
  setUser: () => {
    console.log('set user');
  },
});

export default UserContext;
