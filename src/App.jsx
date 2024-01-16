import { useEffect, useReducer } from "react";
import "./App.css";

import PropTypes from "prop-types";

const intialState = {
  questions: [],
  allOptions: [],
  correctOption: null,
  //status -> loading, error, ready, active, finished
  status: "loading",
  qindex: 0,
  answer: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        allOptions: [
          ...action.payload?.[state.qindex]?.incorrect_answers,
          action.payload?.[state.qindex]?.correct_answer,
        ].sort(() => Math.random() - 0.6),
        correctOption: action.payload?.[state.qindex]?.correct_answer,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "answered":
      return {
        ...state,
        answer: action.payload,
      };
    case "newQuestion":
      return {
        ...state,
        answer: null,
        allOptions: [
          ...state.questions?.[state.qindex]?.incorrect_answers,
          state.questions?.[state.qindex]?.correct_answer,
        ].sort(() => Math.random() - 0.6),
        correctOption: state.questions?.[state.qindex]?.correct_answer,
        qindex: state.qindex + 1,
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [
    { questions, status, qindex, answer, allOptions, correctOption },
    dispatch,
  ] = useReducer(reducer, intialState);
  useEffect(function () {
    fetch(
      "https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.results?.[qindex]);
        dispatch({
          type: "dataRecieved",
          payload: data.results,
        });
      })
      .catch(() =>
        dispatch({
          type: "dataFailed",
        })
      );
  }, []);

  return (
    <div className="h-screen w-full">
      <h1 className="font-heading text-6xl">Quiz App</h1>
      <p>Unleash Your Inner Smarty Pants</p>
      <div>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            category={questions?.[0]?.category}
            dispatch={dispatch}
            // noOfQuestions={questions.length}
          />
        )}
        {status === "active" && (
          <Questions
            question={questions?.[qindex]?.question}
            index={qindex}
            options={allOptions}
            correctOption={correctOption}
            answer={answer}
            dispatch={dispatch}
            qindex={qindex}
          />
        )}
      </div>
    </div>
  );
}

function Loader() {
  return <div>Loading...</div>;
}

function Error() {
  return <div>Error fetching the questions!</div>;
}

function StartScreen({ category, dispatch }) {
  return (
    <div>
      <h2>{`Welcome to the quiz on ${category}!`}</h2>
      <p>{`10 questions to test your mastery`}</p>
      <button onClick={() => dispatch({ type: "start" })}>Let's Start</button>
    </div>
  );
}

StartScreen.propTypes = {
  category: PropTypes.string,
  noOfQuestions: PropTypes.number,
  dispatch: PropTypes.func,
};

function Questions({
  question,
  options,
  correctOption,
  answer,
  dispatch,
  qindex,
}) {
  let correctCss = (index) =>
    answer !== null
      ? index === options.indexOf(correctOption)
        ? "bg-green-400"
        : "bg-red-400"
      : "";

  console.log(`answer =${answer}`);

  return (
    <div>
      <h2>QUESTIONS</h2>
      <div>
        <p>{`${question}`}</p>
        <ul>
          <li>
            {options.map((option, index) => (
              <button
                key={option}
                disabled={answer != null}
                className={`bg-gray-500 w-[40%] m-4 py-2 rounded-lg gap-4 text-white ${
                  answer === index ? "bg-gray-700 underline" : ""
                } ${correctCss(index)}`}
                onClick={() => dispatch({ type: "answered", payload: index })}
              >{`${option}`}</button>
            ))}
          </li>
        </ul>
      </div>
      <Footer qindex={qindex} dispatch={dispatch} answer={answer} />
    </div>
  );
}

Questions.propTypes = {
  question: PropTypes.string,
  options: PropTypes.array,
  answer: PropTypes.number,
  dispatch: PropTypes.func,
  correctOption: PropTypes.string,
  qindex: PropTypes.number,
};

function Footer({ qindex, dispatch, answer }) {
  console.log(`qindex = ${qindex}`);
  return (
    <div className="w-full justify-center items-center content-center mx-4 py-2">
      <Timer />
      <div>
        <button
          className={`${
            qindex === 0 && answer === null ? "hidden" : ""
          } bg-gray-700 text-white rounded-lg px-4 py-2 float-right`}
          onClick={() => dispatch({ type: "newQuestion", payload: qindex })}
        >
          Next
        </button>
      </div>
    </div>
  );
}

Footer.propTypes = {
  qindex: PropTypes.number,
  dispatch: PropTypes.func,
};

function Timer() {
  return (
    <div className="bg-gray-700 text-white rounded-lg px-4 py-2 w-16 float-left">
      5:00
    </div>
  );
}
export default App;
