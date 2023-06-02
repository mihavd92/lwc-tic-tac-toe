import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

export default class TicTacToe extends LightningElement {
    board = Array(9).fill('');
    playerSide = '';
    currentPlayer = null;
    winner = null;
    gameStarted = false;

    startGame(event) {
        const player = event.target.value;
        this.playerSide = player;
        this.currentPlayer = player;
        this.gameStarted = true;
    }

    get message() {
        if (this.winner) {
            return `Winner: ${this.winner}`;
        } else if (this.board.every((cell) => cell !== '')) {
            return 'Tie game';
        } else {
            return `Current player: ${this.currentPlayer}`;
        }
    };

    handleCellClick(event) {
        const index = event.target.dataset.index;
        if (this.board[index] === '' && !this.winner) {
          this.board[index] = this.currentPlayer;
          event.target.textContent = this.currentPlayer;
          event.target.classList.add(this.currentPlayer.toLowerCase()); // додаємо клас "x" або "o" в залежності від гравця
          this.checkForWinner();
          this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
      }
      

      checkForWinner() {
        let isBoardFull = true;
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.currentPlayer;
                const toastEvent = new ShowToastEvent({
                    title: 'Congratulations!',
                    message: `Winner: ${this.winner}`,
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
                return;
            }
        }
        for (let cell of this.board) {
            if (cell === '') {
                isBoardFull = false;
                break;
            }
        }
        if (isBoardFull) {
            this.winner = 'tie';
            const toastEvent = new ShowToastEvent({
                title: 'Game over!',
                message: `It's a tie. Friendship wins!`,
                variant: 'info'
            });
            this.dispatchEvent(toastEvent);
        }
    }
    

    reset() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.winner = null;
        const cells = this.template.querySelectorAll('td');
        cells.forEach((cell) => (cell.textContent = ''));
        this.gameStarted = false;
    }
}