import React from 'react';
import ReactDOM from "react-dom";
import MagicDropzone from "react-magic-dropzone";
import './App.css';


import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

class App extends React.Component {
  state = {
    model: null,
    preview: "",
    predictions: []
  };

  componentDidMount() {
    mobilenet.load().then((model) => {
      this.setState({
        model: model
      });
    });
  }

  onDrop = (accepted, rejected, links) => {
    this.setState({ preview: accepted[0].preview || links[0] });
  };

  onImageChange = (e) => {
    this.state.model.classify(e.target).then((predictions) => {
      this.setState({ predictions: predictions });
    });
  };

  render() {
    return (
      <div className="Dropzone-page">
        {this.state.model ? (
          <MagicDropzone
            className="Dropzone"
            accept="image/jpeg, image/png, .jpg, .jpeg, .png"
            multiple={false}
            onDrop={this.onDrop}
          >
            <div className="Dropzone-content">
              {this.state.preview ? (
                <img
                  alt="upload preview"
                  onLoad={this.onImageChange}
                  className="Dropzone-img"
                  src={this.state.preview}
                />
              ) : (
                "Choose or drop a file."
              )}
            </div>
          </MagicDropzone>
        ) : (
          <div className="Dropzone">Loading model...</div>
        )}
        <div>
          {this.state.predictions.map((item) => (
            <div className="prediction" key={item.className}>
              <div>{item.className}</div>
              <div>{item.probability.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;

