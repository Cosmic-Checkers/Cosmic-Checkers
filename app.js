// import functions and grab DOM elements
import { saveToLocalStorage, randomizer } from './game-utils.js';

const inputForm = document.getElementById('input-form');
// initialize state

// set event listeners to update state and DOM

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(inputForm);
    const playerOneName = formData.get('name1');
    const playerTwoName = formData.get('name2');
    const playerColors = randomizer();
    const playerData = [{ name: playerOneName, wins: 0, losses: 0, draws: 0, color: playerColors[0], lastGameResult: '' }, { name: playerTwoName, wins: 0, losses: 0, draws: 0, color: playerColors[1], lastGameResult: '' }];
    saveToLocalStorage(playerData);
    document.location = 'board-files/board.html';
});

