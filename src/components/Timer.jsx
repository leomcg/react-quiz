import { useEffect } from "react";

function Timer({ dispatch }) {
  useEffect(() => {
    setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);
  }, [dispatch]);

  return <div className="timer">05:00</div>;
}

export default Timer;
