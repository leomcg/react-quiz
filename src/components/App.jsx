/* eslint-disable no-case-declarations */
import { useEffect, useReducer } from "react";
import "./App.css";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Question from "./Question";
import Main from "./MainComponent";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";

function App() {
  const initialState = {
    questions: [],
    status: "loading", // 'loading', 'error', 'ready', 'active', 'finished',
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
    secondsRemaining: null,
  };

  const SECS_PER_QUESTION = 30;

  const reducer = (state, action) => {
    switch (action.type) {
      case "dataReceived":
        return {
          ...state,
          questions: action.payload,
          status: "ready",
          secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        };
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
      case "nextQuestion":
        if (state.index + 1 === state.questions.length) {
          return {
            ...state,
            status: "finished",
            highscore:
              state.points > state.highscore ? state.points : state.highscore,
          };
        }
        return { ...state, index: state.index + 1, answer: null };
      case "restart":
        return {
          ...initialState,
          highscore: state.highscore,
          questions: state.questions,
          status: "active",
        };
      case "tick": {
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining <= 0 ? "finished" : state.status,
        };
      }
      default:
        throw new Error("unknown action");
    }
  };

  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

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
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <div>
              <NextButton dispatch={dispatch} answer={answer} />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </div>
          </>
        )}
      </Main>
      {status === "finished" && (
        <FinishScreen
          points={points}
          maxPoints={maxPoints}
          highscore={highscore}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

export default App;
