import React, { useState } from 'react';
import './App.css'; // Ensure the correct path

const App = () => {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const surpriseOptions = [
    'Does the Image have a whale?',
    'Is the image fabulously pink?',
    'Does the image have puppies',
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    setImage(e.target.files[0]);

    try {
      const options = {
        method: 'POST',
        body: formData,
      };

      const response = await fetch('http://localhost:8000/upload', options);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
      setError('Something went wrong, please try again!');
    }
  };

  const analyzedImage = async () => {
    if (!image) {
      setError('Error! Must have an existing image!');
      return;
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      setResponse(data);
    } catch (error) {
      console.log(error);
      setError('Something didn\'t work, please try again.');
    }
  };

  const clear = () => {
    setImage(null);
    setValue('');
    setResponse('');
    setError('');
  };

  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container">
          {image && (
            <img
              className="image"
              src={URL.createObjectURL(image)}
              alt="Uploaded Preview"
            />
          )}
        </div>

        <p className="extra-info">
          <span>
            <label htmlFor="files" className="upload-label">
              Upload an Image
            </label>
            <input
              onChange={uploadImage}
              id="files"
              accept="image/*"
              type="file"
              hidden
            />
          </span>
          to ask questions about.
        </p>

        <h2 className="heading-text">What do you want to know about the image?</h2>

        <button
          className="suprise-button"
          onClick={surprise}
          disabled={response}
        >
          Surprise Me
        </button>

        <div className="input-container">
          <input
            type="text"
            value={value}
            className="input-field"
            placeholder="What is in the image..."
            onChange={(e) => setValue(e.target.value)}
          />

          {(!response && !error) && (
            <button className="action-button" onClick={analyzedImage}>
              Ask Me
            </button>
          )}
          {(response || error) && (
            <button className="clear-button" onClick={clear}>
              Clear
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        {response && <p className="response-message">{response}</p>}
      </section>
    </div>
  );
};

export default App;
