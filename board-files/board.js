import { redAttacksFrom, redMovesFrom, blackMovesFrom, blackAttacksFrom, isItemInArray, movePiece, removePiece, kingsRow, getKingAttack, getKingMoves } from './board-utils.js';
import { loadFromLocalStorage, saveToLocalStorage } from '../game-utils.js';

const allClickableSquares = document.querySelectorAll('.clickable');
const drawButton = document.getElementById('draw-button');
const turnDisplay = document.getElementById('turn-display');
const nameDisplay = document.getElementById('name-display-area');
const gameBoard = document.getElementById('game-board');
const localStorageData = loadFromLocalStorage();

let boardState = [
    { color: 'red', isKing: false }, { color: 'red', isKing: false }, { color: 'red', isKing: false }, { color: 'red', isKing: false }, 
    { color: 'red', isKing: false }, { color: 'red', isKing: false }, { color: 'red', isKing: false }, { color: 'red', isKing: false },
    { color: 'red', isKing: false }, { color: 'red', isKing: false }, { color: 'red', isKing: false }, { color: 'red', isKing: false }, 
    null, null, null, null,
    null, null, null, null, 
    { color: 'black', isKing: false }, { color: 'black', isKing: false }, { color: 'black', isKing: false }, { color: 'black', isKing: false },
    { color: 'black', isKing: false }, { color: 'black', isKing: false }, { color: 'black', isKing: false }, { color: 'black', isKing: false }, 
    { color: 'black', isKing: false }, { color: 'black', isKing: false }, { color: 'black', isKing: false }, { color: 'black', isKing: false }
];

let squareSelected = [];
let turn = 'black';
let forceJump = false;
let stopMove = false;
let wasLegalClick = false;
let validAttackMade = false;

function updateTurnDisplay() {
    turnDisplay.textContent = turn;
    let text = '';

    for (let i = 0; i < localStorageData.length; i++) {
        if (turn === localStorageData[i].color) {
            text = localStorageData[i].name + ' it is your turn' ;
        }
    }
    nameDisplay.textContent = text;
    if (turn === 'red') {
        turnDisplay.classList.add('red-color');
        gameBoard.classList.add('red-turn');
        gameBoard.classList.remove('black-turn');
    } else {
        turnDisplay.classList.remove('red-color');
        gameBoard.classList.add('black-turn');
        gameBoard.classList.remove('red-turn');
    }
}

function renderBoard() {
    for (let i = 0; i < boardState.length; i++) {
        const currentPiece = boardState[i];
        const currentSquare = allClickableSquares[i];

        currentSquare.classList.remove('king', 'red-piece', 'black-piece');
        if (currentPiece) {
            if (currentPiece.color === 'red') {
                currentSquare.classList.add('red-piece');
            }
            if (currentPiece.color === 'black') {
                currentSquare.classList.add('black-piece');
            }
            if (currentPiece.isKing) {
                currentSquare.classList.add('king');
            }
        } 
    }
}

function setEventListeners() {
    for (let i = 0; i < allClickableSquares.length; i++) {
        const currentClickableSquare = allClickableSquares[i];
        currentClickableSquare.addEventListener('click', () => {
            checkMove(currentClickableSquare);
        });
    }
}

function checkMove(lastClick) {
    const isKingMove = checkKing(lastClick);

    clearSelectedPiece();
    if (squareSelected.length === 1 && boardState[lastClick.id] === null) {

        const isAttackOk = attackOk(lastClick);
        const isNextAttackOk = nextAttackOk(lastClick);

        if (forceJump === false && secondClickOk(lastClick) && stopMove === false) {
            squareSelected.push(lastClick.id);
            boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
            squareSelected = [];

            if (isKingMove) {
                crownKing(lastClick);
            }
           
            turn = switchTurn(turn);
            clearSelectedPiece();
            refreshTurnVariables();
            renderBoard();
   
        } else if (forceJump === false && isAttackOk[0]) {
            squareSelected.push(lastClick.id);
            removePiece(isAttackOk[1], boardState);
            boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
            squareSelected = [lastClick.id];
            allClickableSquares[squareSelected].classList.add('selected');
            validAttackMade = true;
            stopMove = true;
            wasLegalClick = true;
            renderBoard();
            
        } else if (isNextAttackOk[0] && isAttackOk[0]) {
            removePiece(isNextAttackOk[1], boardState);
            forceJump = true;
            wasLegalClick = true;
            squareSelected = [lastClick.id];
            allClickableSquares[squareSelected].classList.add('selected');
        }

        if (validAttackMade === true && !nextMultipleAttackOk(lastClick) && wasLegalClick) {
            validAttackMade = false;
            forceJump = false;
            stopMove = false;
            squareSelected = [];

            if (isKingMove) {
                crownKing(lastClick);
            }
        
            turn = switchTurn(turn);
            refreshTurnVariables();
            clearSelectedPiece();
            renderBoard();
        }
    }
    if (firstClickOk(lastClick)) {
        squareSelected = [lastClick.id];
        allClickableSquares[squareSelected].classList.add('selected');
    }

    wasLegalClick = false;
    updateTurnDisplay();
    checkEndGame();
}

function switchTurn() {
    if (turn === 'red') {
        return 'black';   
    }
    return 'red';
}

function crownKing(lastClick) {
    boardState[lastClick.id].isKing = true;
}

function checkKing(lastClick) {
    return isItemInArray(lastClick.id, kingsRow);
}

function refreshTurnVariables() {
    forceJump = false;
    stopMove = false;
    validAttackMade = false;
}

function getMoves(color, squareNumber) {
    if (color === 'red') {
        return redMovesFrom[squareNumber];
    }
    return blackMovesFrom[squareNumber];
}

function firstClickOk(lastClick) {
    if (boardState[lastClick.id] && boardState[lastClick.id].color === turn) {
        return true;
    }
    return false;
}

function secondClickOk(lastClick) {
    if (squareSelected.length === 1) {
        const possibleMoves = getMoves(turn, squareSelected[0]);
        const isEmpty = isSquareEmpty(lastClick);
        const isAPossibleMove = isItemInArray(lastClick.id, possibleMoves);
        const possibleKingMoves = getKingMoves(squareSelected[0]);
        const isAPossibleKingmove = isItemInArray(lastClick.id, possibleKingMoves);
        
        if (forceJump === false && isEmpty && isAPossibleMove) {
            return true;
        }
        if (boardState[squareSelected[0]] && boardState[squareSelected[0]].isKing && isEmpty && forceJump === false && isAPossibleKingmove) {
            return true;
        }
        return false;
    }
}

function attackOk(lastClick) {
    const currentAttacks = getAttack(squareSelected[0]);
    const currentKingAttacks = getKingAttack(squareSelected[0]);

    if (squareSelected.length === 1) {
        for (let i = 0; i < currentAttacks.length; i++) {
            const clickedId = Number(lastClick.id);
            const currentAttackOption = currentAttacks[i];
            const currentDestination = Number(currentAttackOption.dest);
            const currentJump = Number(currentAttackOption.jump);

            if (currentDestination === clickedId &&
                 isSquareEmpty(lastClick) &&
                  !isSquareIdEmpty(currentJump) &&
                   boardState[currentJump] &&
                   boardState[currentJump].color !== turn) {

                return [true, currentJump];
            }
        }
        if (boardState[squareSelected[0]] && boardState[squareSelected[0]].isKing) {
            for (let i = 0; i < currentKingAttacks.length; i++) {
                const clickedId = Number(lastClick.id);
                const currentAttackOption = currentKingAttacks[i];
                const currentDestination = Number(currentAttackOption.dest);
                const currentJump = Number(currentAttackOption.jump);

                if (currentDestination === clickedId &&
                 isSquareEmpty(lastClick) &&
                  !isSquareIdEmpty(currentJump) &&
                   boardState[currentJump] &&
                   boardState[currentJump].color !== turn) {
                   
                    return [true, currentJump];
                }
            }     
        }
        return [false];
    }
}

function nextAttackOk(lastClick) {
    const possibleNextAttacks = getAttack(lastClick.id);
    const possibleNextKingAttacks = getKingAttack(lastClick.id);

    for (let i = 0; i < possibleNextAttacks.length; i++) {
        const currentAttackOption = possibleNextAttacks[i];
        const currentDestination = Number(currentAttackOption.dest);
        const currentJump = Number(currentAttackOption.jump);

        if (isPossibleJumpEmpty(currentDestination) && !isSquareIdEmpty(currentJump) && boardState[currentJump].color !== turn) {

            return [true, currentJump];
        }
    }
    if (boardState[squareSelected[0]] && boardState[squareSelected[0]].isKing) {
        for (let i = 0; i < possibleNextKingAttacks.length; i++) {
            const currentAttackOption = possibleNextKingAttacks[i];
            const currentDestination = Number(currentAttackOption.dest);
            const currentJump = Number(currentAttackOption.jump);

            if (isPossibleJumpEmpty(currentDestination) && !isSquareIdEmpty(currentJump) && boardState[currentJump].color !== turn) {
                return [true, currentJump];
            }
        }
    }
    return [false];
}

function nextMultipleAttackOk(lastClick) { 
    const possibleNextAttacks = getAttack(lastClick.id);
    const possibleNextKingAttacks = getKingAttack(lastClick.id);

    for (let i = 0; i < possibleNextAttacks.length; i++) {
        const currentAttackOption = possibleNextAttacks[i];
        const currentDestination = Number(currentAttackOption.dest);
        const currentJump = Number(currentAttackOption.jump);

        if (isPossibleJumpEmpty(currentDestination) && !isSquareIdEmpty(currentJump) && boardState[currentJump].color !== turn) {
            return true;
        }
    }
    if (boardState[squareSelected[0]] && boardState[squareSelected[0]].isKing) {
        for (let i = 0; i < possibleNextKingAttacks.length; i++) {
        
            const currentAttackOption = possibleNextKingAttacks[i];
            const currentDestination = Number(currentAttackOption.dest);
            const currentJump = Number(currentAttackOption.jump);

            if (isPossibleJumpEmpty(currentDestination) && !isSquareIdEmpty(currentJump) && boardState[currentJump].color !== turn) {
                return true;
            }
        }
    }
    return false;
}

function isPossibleJumpEmpty(id) {
    if (boardState[id] === null) {
        return true;
    }
    return false;
} 

function getAttack(id) {
    if (turn === 'red') {
        return redAttacksFrom[id];
    } else {
        return blackAttacksFrom[id];
    }
}

function isSquareEmpty(lastClick){
    if (boardState[lastClick.id] === null) {
        return true;
    }
    return false;
}

function isSquareIdEmpty(number) {
    if (boardState[number] === null) {
        return true;
    }
    return false;
}


function playerColor(color) {
    for (let i = 0; i < localStorageData.length; i++) {
        const currentPlayer = localStorageData[i];

        if (currentPlayer.color === color) {
            return currentPlayer;
        }
    }
    return null;
}

function checkEndGame() {
    let red = 0;
    let black = 0;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] && boardState[i].color === 'red') {
            red++;
        }
        if (boardState[i] && boardState[i].color === 'black') {
            black++;
        }
    }
    if (red === 0) {
        const winningPlayer = playerColor('black');
        const losingPlayer = playerColor('red');
        winningPlayer.wins++;
        losingPlayer.losses++;
        winningPlayer.lastGameResult = 'win';
        losingPlayer.lastGameResult = 'loss';
        saveToLocalStorage(localStorageData);
        document.location = '../results/results.html';
    }
    if (black === 0) {
        const winningPlayer = playerColor('red');
        const losingPlayer = playerColor('black');
        winningPlayer.wins++;
        losingPlayer.losses++;
        winningPlayer.lastGameResult = 'win';
        losingPlayer.lastGameResult = 'loss';
        saveToLocalStorage(localStorageData);
        document.location = '../results/results.html';
    }
}

function resetLastGameResult() {
    localStorageData[0].lastGameResult = '';
    localStorageData[1].lastGameResult = '';
}

function clearSelectedPiece() {
    for (let i = 0; i < allClickableSquares.length; i++) {
        const currentClickableSquare = allClickableSquares[i];
        currentClickableSquare.classList.remove('selected');
    }
}

drawButton.addEventListener('click', () => {
    const userConfirm = confirm('...like...seriously??');
    
    if (userConfirm) {
        localStorageData[0].draws++;
        localStorageData[1].draws++;
        saveToLocalStorage(localStorageData);
        document.location = '../results/results.html';
    }
});

resetLastGameResult();
updateTurnDisplay();
renderBoard();
setEventListeners();