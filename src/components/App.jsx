/* eslint-disable no-case-declarations */
import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Question from "./Question";
import Main from "./MainComponent";
import StartScreen from "./StartScreen";

function App() {
  const initialState = {
    questions: [],
    status: "loading", // 'loading', 'error', 'ready', 'active', 'finished',
    index: 0,
    answer: null,
    points: 0,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
        return { ...state, status: "error" };
      case "start":
        return { ...state, status: "active" };
      case "newAnswer":
        const question = state.questions[state.index];
        const answer = action.payload;

        return {
          ...state,
          answer,
          points:
            question.correctOption === answer
              ? state.points + question.points
              : state.points,
        };
      default:
        throw new Error("unknown action");
    }
  };

  const [{ questions, status, index, answer }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const numQuestions = questions.length;

  useEffect(() => {
    fetch("/questions").then((res) => {
      res
        .json()
        .then((data) => {
          dispatch({ type: "dataReceived", payload: data });
        })
        .catch((err) => {
          console.log(err);
          dispatch({ type: "dataFailed" });
        });
    });
    // console.log(state);
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
