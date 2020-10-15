import React, { useState } from 'react';
import Board from '../Board';
import calculateWinner from '../Game/gameServices'

function Game(props) {
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null),
    }]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    const [isAscending, setIsAscending] = useState(true);

    const handleClick = (i) => {
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const newSquares = current.squares.slice();

        if (calculateWinner(newSquares).winner || newSquares[i]) {
            return;
        }
        newSquares[i] = xIsNext ? 'X' : 'O';

        setHistory(newHistory.concat([{
            squares: newSquares,
            lastestMoveSquare: i,
        }]));
        setXIsNext(!xIsNext);
        setStepNumber(newHistory.length);
        /*this.setState({
            history:
                xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });*/
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
        /*this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });*/
    }

    const handleSortToggle = () => {
        setIsAscending(!isAscending);
        /*this.setState({
            isAscending: !this.state.isAscending,
        })*/
    }

    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;
    const isDraw = winInfo.isDraw;

    let moves = history.map((step, move) => {
        const lastestMoveSquare = step.lastestMoveSquare;
        const col = 1 + lastestMoveSquare % 3;
        const row = 1 + Math.floor(lastestMoveSquare / 3);
        const desc = move ?
            `Go to move #${move} (${col}, ${row})` :
            'Go to game start';
        return (
            <li key={move}>
                <button
                    className={move === stepNumber ? 'move-list-item-selected' : ''} //bold the currently selected item
                    onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    if (!isAscending) {
        moves.reverse();
    }

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        if (isDraw) {
            status = 'The game is draw';
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={i => handleClick(i)}
                    winLine={winInfo.line}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => handleSortToggle()}>
                    {isAscending ? 'Descending' : 'Ascending'}
                </button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

export default Game;