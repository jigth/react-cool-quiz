import { useState } from "react";
import './Quiz.css'

type Question = {
  question: string,
  answer: string,
  options: string[],
}

const questions: Question[] = [
  {
    question: "What is the natural satellite closest to The Earth?",
    answer: "The Moon",
    options: [
      "Jupiter",
      "The Moon",
      "ET Spaceship",
      "YOLO!"
    ]
  },
  {
    question: "What was the original name of the song \Fly me to the Moon\" when it was first sang?",
    answer: "In Other Words",
    options: [
      "In Other Words",
      "Fly me to the sun",
      "In Jupiter and Mars",
    ]
  },
  {
    question: "What's the friend and enemy of Jerry?",
    answer: "Tom",
    options: [
      "Silvester Stallone",
      "Tom",
      "Bull",
    ]
  },
  {
    question: "What's the average Earth's gravity force in M/S^2?",
    answer: "9.8 M/S^2",
    options: [
      "5.8 M/S^2",
      "10.8 M/S^2",
      "9.8 M/S^2",
    ]
  },
]

type QuizState = {
  currentIndex: number,
  currentAnswer: string,
  answers: string[],
  totalQuestions: number,
  score: number,
  lastOperation: string, // Handle the score when going back
  operationHistory: string[], // Handle the score when going back
}

export function Quiz() {

  const getInitialState = (): QuizState => ({
    currentIndex: 0,
    currentAnswer: "",
    answers: [],
    totalQuestions: questions.length,
    score: 0,
    lastOperation: "",
    operationHistory: [],
  })

  const [state, setState] = useState<QuizState>(getInitialState())

  const handleAnswerChange = (event: any) => {
    setState({
      ...state,
      currentAnswer: event.target.value,
    })
  }

  const resetRadioButtons = (btnsName: string) => {
    document.getElementsByName(btnsName).forEach(btn => {
      // @ts-ignore
      btn.checked = false
    })
  }

  /** Selects radio button of type string by value from a group of them selected by name */
  const selectStringRadioButton = (btnsName: string, radioBtnValue: string) => {
    const btnToSelect = Array.from(document.getElementsByName(btnsName)).find(
      btnNode => {
        //@ts-ignore
        return btnNode.value === radioBtnValue
      }
    ) || null;

    // @ts-ignore
    if (btnToSelect) btnToSelect.checked = true
  }

  const handleNextQuestion = () => {
    if (state.currentAnswer == "") {
      alert("Please select an answer")
      return
    }

    const correctAnswer = state.currentAnswer === questions[state.currentIndex].answer
    const lastOperation = correctAnswer ? "increment" : "keep"
    const nextIndex = state.currentIndex + 1

    setState({
      ...state,
      score: correctAnswer
        ? ++state.score
        : state.score,
      currentIndex: nextIndex,
      answers: [...state.answers, state.currentAnswer],
      currentAnswer: "",
      lastOperation,
      operationHistory: [...state.operationHistory, lastOperation],
    })

    resetRadioButtons(`option${nextIndex}`)
  }

  const handlePreviousQuestion = () => {
    
    const lastOperation = state.currentIndex >= 0 
      ? state.operationHistory[state.currentIndex-1] : ""
    const currentIndex = --state.currentIndex
    const lastAnswer = state.answers[state.answers.length - 1]

    // Wait some time so the DOM is ready before selecting the radio buttons.
    // It appears that even a value of 0 works so I kept that.
    setTimeout(() => selectStringRadioButton(`option${currentIndex+1}`, lastAnswer), 0)

    setState({
      ...state,
      score: lastOperation === "increment" ? --state.score : state.score, // Undo the score from previous answer
      currentIndex,
      answers: [...state.answers.slice(0, state.currentIndex)],
      currentAnswer: lastAnswer,
      lastOperation,
      operationHistory: state.operationHistory.slice(0, state.currentIndex)
    })
  }

  const handleSubmit = () => {
    const correctAnswer = state.currentAnswer === questions[state.currentIndex].answer
    setState({
      ...state,
      score: correctAnswer
        ? ++state.score
        : state.score,
      answers: [...state.answers, state.currentAnswer],
      currentIndex: --state.currentIndex,
      currentAnswer: "",
    })

    const congratsMsg = `Congratulations you completed the quiz with a score of ${state.score} out of ${state.totalQuestions}`
    console.log(congratsMsg)
    console.log({
      "your answers": state.answers,
      score: state.score,
    })

    alert(congratsMsg)

    cleanQuiz()
  }

  const cleanQuiz = () => {
    alert('cleaning quiz')
    setState(getInitialState())

    // Wait some time for the radio buttons to be ready before cleaning them
    // (0 is working for React for a reason I don't currently know)
    setTimeout(() => resetRadioButtons('option1'), 0)
    alert('done')
  }


  return (
    <div className="quiz">
      <h1 className="quiz-title">The Cool Quiz</h1>

      <div className="quiz-instructions" style={{ display: state.currentIndex > 0 ? 'none' : ''}}>
        <h3>Instructions</h3>
        <p style={{ width: "20vw"}}>Please select and answer in each round and in the last question just press the "submit" button.</p>
        <p style={{ width: "20vw"}}>Each time you select the correct answer you will get a point, each time you select a wrong one you will not get any points for that question. Good luck</p>
      </div>

      <div>
        <p className="quiz-question">{questions[state.currentIndex] 
          ? questions[state.currentIndex].question
          : "No question was loaded, please reload the page or contact dev team" }</p>
        
        <div className="quiz-options">
          {
            questions[state.currentIndex].options.map((option: string, i: number) => (
              <div key={i}>
                <input onChange={handleAnswerChange} type="radio" name={`option${state.currentIndex+1}`} id={`${i+1}`} value={option} />
                
                <label>{option}</label>
              </div>
            ))
          }
        </div>

        <br />

        <div className="quiz-navigation">
          <button 
            onClick={handlePreviousQuestion}
            disabled={state.currentIndex <= 0}
            style={{ margin: "0 5px", display: state.currentIndex <= 0 ? 'none': '', }}
          >Prev</button>
          <button onClick={handleNextQuestion} style={{ margin: "0 5px", display: state.currentIndex >= questions.length-1 ? 'none': ''}}>Next</button>

          <button onClick={handleSubmit} style={{ margin: "0 5px", display: state.currentIndex < questions.length-1 ? 'none' : '' }}>Submit</button>
        </div>
      </div>
    </div>
  )
}