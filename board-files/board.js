import { redAttacksFrom, redMovesFrom, blackMovesFrom, blackAttacksFrom, isItemInArray, movePiece, removePiece } from './board-utils.js';

const allClickableSquares = document.querySelectorAll('.clickable');

let boardState = [
    { id: 0, color: 'red', isKing: false }, { id: 1, color: 'red', isKing: false }, { id: 2, color: 'red', isKing: false }, { id: 3, color: 'red', isKing: false }, 
    { id: 4, color: 'red', isKing: false }, { id: 5, color: 'red', isKing: false }, { id: 6, color: 'red', isKing: false }, { id: 7, color: 'red', isKing: false },
    { id: 8, color: 'red', isKing: false }, { id: 9, color: 'red', isKing: false }, { id: 10, color: 'red', isKing: false }, { id: 11, color: 'red', isKing: false }, 
    null, null, null, null,
    null, null, null, null, 
    { id: 12, color: 'black', isKing: false }, { id: 13, color: 'black', isKing: false }, { id: 14, color: 'black', isKing: false }, { id: 15, color: 'black', isKing: false },
    { id: 16, color: 'black', isKing: false }, { id: 17, color: 'black', isKing: false }, { id: 18, color: 'black', isKing: false }, { id: 19, color: 'black', isKing: false }, 
    { id: 20, color: 'black', isKing: false }, { id: 21, color: 'black', isKing: false }, { id: 22, color: 'black', isKing: false }, { id: 23, color: 'black', isKing: false }
];

let squareSelected = [];
let turn = 'black';

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
    if (secondMoveOk(lastClick)) {
        squareSelected.push(lastClick.id);
        boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
        renderBoard();
        squareSelected = [];
        turn = switchTurn(turn);
    }
    if (firstMoveOk(lastClick)) {
        console.log(boardState[lastClick.id].id);
        squareSelected.push(lastClick.id);
    }
    refreshSelected();
}

function refreshSelected() {
    console.log('refresh selected');
}

function secondAttackOk(lastClick) {
    
    const isKing = boardState[lastClick.id].isKing;
    // const possibleAttack = 

    console.log(isKing);
    // if lastClick is empty, if move in same direction is opposite color
}

function getAttack(color, squareNumber) {
    if (color === 'red') {
        return redAttacksFrom[squareNumber];
    }
    return blackAttacksFrom[squareNumber];

}

function getMoves(color, squareNumber) {
    if (color === 'red') {
        return redMovesFrom[squareNumber];
    }
    return blackMovesFrom[squareNumber];

}

function firstMoveOk(lastClick) {
    if (boardState[lastClick.id] && boardState[lastClick.id].color === turn) {
        return true;
    }
    return false;
}

function secondMoveOk(lastClick) {
    if (squareSelected.length === 1) {
        const possibleMoves = getMoves(turn, squareSelected[0]);
        const isEmpty = isSquareEmpty(lastClick);
        
        const isAPossibleMove = isItemInArray(lastClick.id, possibleMoves);
      
        if (isEmpty && isAPossibleMove) {
            return true;
        }
        squareSelected.pop();
        return false;

    }
}

function isSquareEmpty(lastClick){
    if (boardState[lastClick.id] === null) {
        return true;
    }
    return false;
}

function switchTurn(currentTurn) {
    if (turn === 'red') {
        return 'black';
        
    }
    return 'red';


}

renderBoard();
setEventListeners();
