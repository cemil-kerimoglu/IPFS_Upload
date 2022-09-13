import './App.css';
import { useState } from 'react';
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from 'buffer';

const projectId = process.env.REACT_APP_PROJECT_ID;
const projectSecret = process.env.REACT_APP_API_SECRET_KEY;

console.log(projectId);
console.log(projectSecret);
console.log(process.env);
const authorization = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString('base64');

const App = () => {

  const [images, setImages] = useState([]);
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = (form[0]).files;
    if (!files || files.length === 0) {
      return alert("No files selected");
    }
    const file = files[0];
    // upload files
    const result = await ipfs.add(file);
    setImages([...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
    form.reset();
  };

  return (
    <div className="App">
      <header className="App-header">IPFS Project</header>
      <div className="main">
        <form className="form" onSubmit={handleSubmit}>
          <input type="file" name="file" />
          <button type="submit" className="btn">Upload file</button>
        </form>
      </div>
      
      <div className="display">
        {images?.map((image, index) => (
            <img
            alt={`Uploaded #${index + 1}`}
            src={"https://ipfsuploadapp.infura-ipfs.io/ipfs/" + image.path}
              style={{ maxWidth: "400px", margin: "15px" }}
              key={image.cid.toString() + index}
            />
        ))}
      </div>
    </div>
  );
}

export default App;

