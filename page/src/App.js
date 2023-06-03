import "./App.css";
import Navbar from "./components/Navbar.jsx";
import MintComponent from "./components/MintComponent.jsx";
import ShowNfts from "./components/ShowNfts";

function App() {
  return (
    <div className="App">
      <Navbar />
      <h1>Mint Your Dog!</h1>
      <MintComponent />
    </div>
  );
}

export default App;
