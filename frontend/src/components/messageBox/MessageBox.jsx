import React from 'react';
import Alert from 'react-bootstrap/Alert';
import './MessageBox.scss';

// This is the message box which holds the message from the backend with preverable colors
// This has to be imported into the jsx

const MessageBox = (props) => {
  return (
    <Alert variant={props.variant || 'info'} className="message-box">
      {props.children}
    </Alert>
  );
};

export default MessageBox;
