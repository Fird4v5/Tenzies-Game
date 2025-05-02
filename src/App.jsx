import {useState, useRef, useEffect} from 'react';
import Die from './Die.jsx';
import { nanoid } from 'nanoid';
import ReactConfetti from 'react-confetti';
import {useWindowSize} from 'react-use'; 


const App = () => {

const generateObj = () => {
  return {
    id: nanoid(),
    value: Math.ceil(Math.random() * 6),
    isHeld: false
  }
}

const allNewDice = () => {
  return Array.from({length: 10}, generateObj);
}

const [dice, setDice] = useState(allNewDice);
const { width, height } = useWindowSize();
const buttonRef = useRef(null);

const rollDice = () => {
  if (gameWon) {
    setDice(allNewDice);
  } else {
    setDice(oldDice => oldDice.map(die => die.isHeld ? die : generateObj()))
  }
}

const isClicked = (id) => {
  setDice(oldDice => oldDice.map(die => die.id === id ? {...die, isHeld: !die.isHeld}: die));
}

const gameWon = dice.every(die => die.isHeld && die.value === dice[0].value); 


useEffect(() => {

  if (gameWon) {
    buttonRef.current.focus(); 
  }

}, [gameWon])

const diceElements = dice.map((die) => <Die 
                                        isClicked={() => isClicked(die.id)} 
                                        key={die.id} 
                                        value={die.value}
                                        isHeld={die.isHeld}/>) 

  return (
    <main>
      {gameWon && <ReactConfetti
                    width={width}
                    height={height}/>}
      <div aria-live='polite' className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'><span>Roll until all dice are the same. Click</span> <span>each die to freeze it at its current</span> value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button onClick={rollDice} className='roll-btn' ref={buttonRef}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  )
}

export default App