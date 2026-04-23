function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null && answer !== undefined;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          className={`btn btn-option ${index === answer ? "answer" : ""} ${hasAnswered ? (index === question.correctOption ? "correct" : "wrong") : ""}`}
          disabled={hasAnswered}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
