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
  points: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
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
        answer: action.payload.index,
        points: action.payload.points,
      };
    case "newQuestion":
      return {
        ...state,
        answer: null,
        qindex: state.qindex + 1,
      };
    case "finished":
      return {
        ...state,
        status: "finished",
      };
    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [{ questions, status, qindex, answer, points }, dispatch] = useReducer(
    reducer,
    intialState
  );
  useEffect(function () {
    fetch(
      "https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.response_code > 0) {
          throw Error("error");
        }

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
      <h1 className="font-heading text-8xl">Quiz App</h1>
      <p className="text-2xl">Unleash Your Inner Smarty Pants</p>
      <div className="items-center justify-center ">
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
          <>
            <Header qindex={qindex} questions={questions} points={points} />
            <Questions
              question={questions?.[qindex]?.question}
              index={qindex}
              options={[
                ...questions?.[qindex]?.incorrect_answers,
                questions?.[qindex]?.correct_answer,
              ]}
              correctOption={questions?.[qindex]?.correct_answer}
              answer={answer}
              dispatch={dispatch}
              qindex={qindex}
              points={points}
            />
            <Footer qindex={qindex} dispatch={dispatch} answer={answer} />
          </>
        )}
        {status === "finished" && (
          <Finished points={points} questions={questions} />
        )}
      </div>
    </div>
  );
}

function Loader() {
  return <div>Loading...</div>;
}

function Error() {
  return (
    <div className="text-xl p-2 bg-red-200 rounded-lg w-[40%]">
      Error fetching the questions! <br /> Try Reloading
    </div>
  );
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
  points,
}) {
  let correctCss = (index) =>
    answer !== null
      ? index === options.indexOf(correctOption)
        ? "bg-green-400"
        : "bg-red-400"
      : "";
  let score = (index) =>
    points + (index === options.indexOf(correctOption) ? 10 : 0);
  console.log(`answer =${answer}`);
  console.log(`correct option => ${correctOption}`);

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
                onClick={() =>
                  dispatch({
                    type: "answered",
                    payload: { index: index, points: score(index) },
                  })
                }
              >{`${option}`}</button>
            ))}
          </li>
        </ul>
      </div>
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
  points: PropTypes.number,
};

function Header({ qindex, questions, points }) {
  return (
    <div className="w-full mx-4 py-2">
      <ProgressBar qindex={qindex} />
      <p className="float-left">{`Question: ${qindex + 1}/${
        questions.length
      }`}</p>
      <p className="float-left">{`Score: ${points}/${
        questions.length * 10
      }`}</p>
    </div>
  );
}

Header.propTypes = {
  qindex: PropTypes.number,
  questions: PropTypes.array,
  points: PropTypes.number,
};

function Footer({ qindex, dispatch, answer }) {
  console.log(`qindex = ${qindex}`);
  return (
    <div className="w-full justify-center items-center content-center mx-4 py-2">
      <Timer />
      {qindex < 9 && (
        <div>
          <button
            className={`${
              qindex === 0 && answer === null ? "hidden" : ""
            } bg-gray-700 text-white rounded-lg px-4 py-2 float-right`}
            onClick={() => dispatch({ type: "newQuestion" })}
          >
            Next
          </button>
        </div>
      )}
      {qindex === 9 && (
        <div>
          <button
            className={`${
              qindex === 0 && answer === null ? "hidden" : ""
            } bg-gray-700 text-white rounded-lg px-4 py-2 float-right`}
            onClick={() => dispatch({ type: "finished" })}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}

Footer.propTypes = {
  qindex: PropTypes.number,
  dispatch: PropTypes.func,
  answer: PropTypes.number,
};

function Timer() {
  return (
    <div className="bg-gray-700 text-white rounded-lg px-4 py-2 w-16 float-left">
      5:00
    </div>
  );
}

function Finished({ points, questions }) {
  return (
    <div>
      <p>{`You Scored ${points} out of ${questions.length * 10}`}</p>
    </div>
  );
}

Finished.propTypes = {
  points: PropTypes.number,
  questions: PropTypes.array,
};

//TODO
function ProgressBar({ qindex }) {
  let progressPercentage = (qindex + 1) * 10;
  return (
    <div className="w-full bg-gray-200 rounded-lg">
      <div
        className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-.8 leading-none rounded-lg w-[${
          (qindex + 1) * 10
        }%]`}
      >
        {`${progressPercentage}%`}
      </div>
    </div>
  );
}
export default App;
