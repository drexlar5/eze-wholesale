import React from 'react';
import { Router } from '@reach/router';
import App from './App';
import Main from './components/main';

function Route() {
  return (
    <Router>
      <App path="/">
        <Main path=":request" />
      </App>
    </Router>
  );
}

export default Route;
