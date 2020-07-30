import { loadFromLocalStorage } from '../game-utils.js';

const localStorageData = loadFromLocalStorage();
const gameResult = document.getElementById('game-result');
const playerOneStats = document.getElementById('player-one-stats');
const playerTwoStats = document.getElementById('player-two-stats');
const playerOne = localStorageData[0];
const playerTwo = localStorageData[1];

function displayResultData() {

    if (playerOne.lastGameResult === 'win') {
        gameResult.textContent = `Congratulations ${playerOne.name}! You have won!`;
    } else if (playerTwo.lastGameResult === 'win') {
        gameResult.textContent = `Congratulations ${playerTwo.name}! You have won!`;
    } else {
        gameResult.textContent = `It's a draw!`;
    }

    playerOneStats.textContent = `${playerOne.name}: Wins (${playerOne.wins}), Losses (${playerOne.losses}), Draws (${playerOne.draws})`;
    playerTwoStats.textContent = `${playerTwo.name}: Wins (${playerTwo.wins}), Losses (${playerTwo.losses}), Draws (${playerTwo.draws})`;
}

displayResultData();