import "./App.css";

import MintComponent from "./components/MintComponent.jsx";
import ShowNfts from "./components/ShowNfts";

function App() {
  return (
    <div className="App">
      <h1>Mint Your Dog!</h1>
      <MintComponent />
      <ShowNfts />
    </div>
  );
}

export default App;
