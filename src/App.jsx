import { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Main from "./MainComponent";

function App() {
  const fetchData = () => {
    fetch("/questions").then((res) => {
      res
        .json()
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    });
  };

  useEffect(() => {
    const data = fetchData();
    console.log(data);
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  );
}

export default App;
