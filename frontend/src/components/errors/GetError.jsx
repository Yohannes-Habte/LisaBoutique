// This function shows the user the message provided in the backend
// Go to the try catch in the useEffect hook. Then, import GetError function

const GetError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message // Specific error message for a specific data from the backend
    : error.message; // General error message from the backend
};

export default GetError;
