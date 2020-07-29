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


// let boardState = [ 
//     null, null, null, null,
//     null, null, null, null,
//     null, null, { id: 0, color: 'red', isKing: false }, null,
//     null, null, null, null,
//     null, { id: 0, color: 'red', isKing: false }, null, null,
//     null, null, null, null,
//     { id: 0, color: 'red', isKing: false }, null, null, null,
//     { id: 0, color: 'black', isKing: false }, null, null, null,
// ];

let squareSelected = [];
let turn = 'black';
let forceJump = false;
let validAttackMade = false;


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

function attackOk(lastClick) {
    const currentAttacks = getAttack(squareSelected[0]);
    if (squareSelected.length === 1) {
        for (let i = 0; i < currentAttacks.length; i++) {
            const clickedId = Number(lastClick.id);
            const currentAttackOption = currentAttacks[i];
            const currentDestination = Number(currentAttackOption.dest);
            const currentJump = Number(currentAttackOption.jump);

            if (currentDestination === clickedId &&
                 isSquareEmpty(lastClick) &&
                  !isSquareEmpty(currentJump) &&
                   boardState[currentJump] &&
                   boardState[currentJump].color !== turn) {
                removePiece(currentJump, boardState);
                return true;
            }
        }
        return false;
    }
}

function checkMove(lastClick) {
    
    if (squareSelected.length === 1 && boardState[lastClick.id] === null) {
        if (forceJump === false && secondMoveOk(lastClick)) {
            squareSelected.push(lastClick.id);
            boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
            renderBoard();
            forceJump = false;
            squareSelected = [];
            turn = switchTurn(turn);
        } else if (forceJump === false && attackOk(lastClick)) {
            //EVERYTHING that happens when you jump
            squareSelected.push(lastClick.id);
            boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
            squareSelected = [lastClick.id];
            validAttackMade = true;
            renderBoard();
            
            
           
        } else if (nextAttackOk(lastClick)) {
            forceJump = true;
            squareSelected = [lastClick.id];
            
        }
     
        if (validAttackMade === true && !nextMultipleAttackOk(lastClick)) {
        
            validAttackMade = false;
            forceJump = false;
            squareSelected = [];
            turn = switchTurn(turn);
        }

    }
    


    if (forceJump === false && firstMoveOk(lastClick)) {
        //console.log(boardState[lastClick.id].id);
        squareSelected = [lastClick.id];
    }
    refreshSelected();
   console.log(turn);
   console.log(squareSelected);
}

function refreshSelected() {
    //console.log('refresh selected');
}



function nextMultipleAttackOk(lastClick) {
    
    const possibleNextAttacks = getAttack(lastClick.id);

    for (let i = 0; i < possibleNextAttacks.length; i++) {
        
        const currentAttackOption = possibleNextAttacks[i];
        const currentDestination = Number(currentAttackOption.dest);
        const currentJump = Number(currentAttackOption.jump);

        if (isPossibleJumpEmpty(currentDestination) && !isSquareEmpty(currentJump)) {
            
            return true;
        }
    }
    return false;

}


function nextAttackOk(lastClick) {
    
    const possibleNextAttacks = getAttack(lastClick.id);

    for (let i = 0; i < possibleNextAttacks.length; i++) {
        
        const currentAttackOption = possibleNextAttacks[i];
        const currentDestination = Number(currentAttackOption.dest);
        const currentJump = Number(currentAttackOption.jump);

        if (isPossibleJumpEmpty(currentDestination) && !isSquareEmpty(currentJump) && boardState[currentJump].color !== turn) {
            removePiece(currentJump, boardState);
            return true;
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
    
        if (forceJump === false && isEmpty && isAPossibleMove) {
            return true;
        }

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
