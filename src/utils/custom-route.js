import React from 'react';
import { Redirect } from '@reach/router';

const CustomRoute = (Component) => (props) => {
  return <Component {...props} /> || <Redirect to="/" replace noThrow />;
};

export default CustomRoute;