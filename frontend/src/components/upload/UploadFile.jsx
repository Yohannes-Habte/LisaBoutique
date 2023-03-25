import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

import './UploadFile.scss';

const UploadFile = ({ files, setFile }) => {
  // Function that handle uploading files
  const uploadHandler = (event) => {
    setFile(event.target.files);
  };

  return (
    <React.Fragment>
      <div className="input-files-container">
        <input
          type="file"
          name="files"
          className="input-file"
        />
        <button className="input-btn">
          <FontAwesomeIcon icon={faUpload} className="icon" /> Upload{' '}
          <small className="supported-files"> (PDF, JPG, & PNG)</small>
        </button>
      </div>
    </React.Fragment>
  );
};

export default UploadFile;
