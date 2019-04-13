import React from "react";

class App extends React.Component {
  componentDidMount() {
    fetch("http://localhost:8000/api/data")
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data:", data);
      })
      .catch(err => {
        console.log("errors", err);
      });
  }

  render() {
    return (
      <div className="container">
        <h1>Hello App</h1>
      </div>
    );
  }
}

export default App;
