function Options({ question, dispatch, answer }) {
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          className={`btn btn-option ${index === answer ? "answer" : ""} ${answer ? (index === question.correctOption ? "correct" : "wrong") : ""}`}
          disabled={answer}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
