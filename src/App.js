import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    
    const [tenzies, setTenzies] = React.useState(false)
    
    const [rolls, setRolls] = React.useState(1)
    
    const [bestRoll, setBestRoll] = React.useState(localStorage.getItem('rolls'))
        
    React.useEffect(() => {
       if ((dice.every(die => die.value === dice[0].value)) && dice.every(die => die.isHeld)) {
           setTenzies(true)
           findBestScore()
       }
    },[dice])
    
    
    

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    
    function rollDice() {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
        setRolls(prevRolls => ++prevRolls)
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    
    function newGame() {
        setDice(allNewDice())
        setTenzies(false)
        setRolls(1)
    }
    
    function findBestScore() {
        localStorage.setItem('rolls',rolls)
        setBestRoll(prevRoll => (
            localStorage.getItem('rolls') < prevRoll ? localStorage.getItem('rolls') : prevRoll
        ))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
        {tenzies ? <Confetti /> : ''}
            <h3>Rolls: {rolls}</h3>
            
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={tenzies ? newGame : rollDice}>{tenzies ? 'New Game' : 'Roll'}</button>
        </main>
    )
}