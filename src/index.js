import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    const className = 'square' + (props.highlight ? ' highlight' : '');
    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const winLine = this.props.winLine;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={(winLine && winLine.includes(i))}
            />
        );
    }

    render() {
        /*using 2 loops to create squares */
        const boardSize = 3;
        let squares = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(this.renderSquare(i * boardSize + j));
            }
            squares.push(<div key={i} className="board-row">{row}</div>);
        }
        return (
            <div>
                {squares}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            isAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastestMoveSquare: i,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleSortToggle() {
        this.setState({
            isAscending: !this.state.isAscending,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winInfo = calculateWinner(current.squares);
        const winner = winInfo.winner;
        const isDraw = winInfo.isDraw;
        const isAscending = this.state.isAscending;

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
                        className={move === this.state.stepNumber ? 'move-list-item-selected' : ''} //bold the currently selected item
                        onClick={() => this.jumpTo(move)}>{desc}</button>
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
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winLine={winInfo.line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.handleSortToggle()}>
                        {isAscending ? 'Descending' : 'Ascending'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: lines[i],
                isDraw: false,
            }
        }
    }

    let isDraw = true;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            isDraw = false;
            break;
        }
    }

    return {
        winner: null,
        line: null,
        isDraw: isDraw,
    };
}