import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingBox = () => {
  return (
    <Spinner animation="border" variant="success" role="status">
      <span className="visually-hidden"> Please wait, it is Loading... </span>
    </Spinner>
  );
};

export default LoadingBox;
