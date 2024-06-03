import React from "react";
import ImageUploader from "./component/image_upload";
import "./index.css";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fire Detection</h1>
      </header>
      <ImageUploader />
    </div>
  );
}

export default App;
