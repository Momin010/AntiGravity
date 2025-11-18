import React, { useState } from 'react';
import './Calculator.scss';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(String(digit));
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? String(digit) : display + digit);
        }
    };

    const inputDot = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
            setWaitingForOperand(false);
        }
    };

    const clear = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const toggleSign = () => {
        setDisplay(String(parseFloat(display) * -1));
    };

    const percent = () => {
        setDisplay(String(parseFloat(display) / 100));
    };

    const performOperation = (nextOperator) => {
        const inputValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(inputValue);
        } else if (operator) {
            const currentValue = prevValue || 0;
            const newValue = calculate(currentValue, inputValue, operator);
            setPrevValue(newValue);
            setDisplay(String(newValue));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (prev, next, op) => {
        switch (op) {
            case '+': return prev + next;
            case '-': return prev - next;
            case '*': return prev * next;
            case '/': return prev / next;
            default: return next;
        }
    };

    return (
        <div className="calculator">
            <div className="display">{display}</div>
            <div className="keypad">
                <button className="function" onClick={clear}>{display === '0' ? 'AC' : 'C'}</button>
                <button className="function" onClick={toggleSign}>±</button>
                <button className="function" onClick={percent}>%</button>
                <button className="operator" onClick={() => performOperation('/')}>÷</button>

                <button onClick={() => inputDigit(7)}>7</button>
                <button onClick={() => inputDigit(8)}>8</button>
                <button onClick={() => inputDigit(9)}>9</button>
                <button className="operator" onClick={() => performOperation('*')}>×</button>

                <button onClick={() => inputDigit(4)}>4</button>
                <button onClick={() => inputDigit(5)}>5</button>
                <button onClick={() => inputDigit(6)}>6</button>
                <button className="operator" onClick={() => performOperation('-')}>−</button>

                <button onClick={() => inputDigit(1)}>1</button>
                <button onClick={() => inputDigit(2)}>2</button>
                <button onClick={() => inputDigit(3)}>3</button>
                <button className="operator" onClick={() => performOperation('+')}>+</button>

                <button className="zero" onClick={() => inputDigit(0)}>0</button>
                <button onClick={inputDot}>.</button>
                <button className="operator" onClick={() => performOperation('=')}>=</button>
            </div>
        </div>
    );
};

export default Calculator;
