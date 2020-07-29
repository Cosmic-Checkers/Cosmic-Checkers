import { redAttacksFrom, redMovesFrom, blackMovesFrom, blackAttacksFrom, isItemInArray, movePiece, removePiece, kingsRow } from './board-utils.js';

const allClickableSquares = document.querySelectorAll('.clickable');

// let boardState = [
//     { id: 0, color: 'red', isKing: false }, { id: 1, color: 'red', isKing: false }, { id: 2, color: 'red', isKing: false }, { id: 3, color: 'red', isKing: false }, 
//     { id: 4, color: 'red', isKing: false }, { id: 5, color: 'red', isKing: false }, { id: 6, color: 'red', isKing: false }, { id: 7, color: 'red', isKing: false },
//     { id: 8, color: 'red', isKing: false }, { id: 9, color: 'red', isKing: false }, { id: 10, color: 'red', isKing: false }, { id: 11, color: 'red', isKing: false }, 
//     null, null, null, null,
//     null, null, null, null, 
//     { id: 12, color: 'black', isKing: false }, { id: 13, color: 'black', isKing: false }, { id: 14, color: 'black', isKing: false }, { id: 15, color: 'black', isKing: false },
//     { id: 16, color: 'black', isKing: false }, { id: 17, color: 'black', isKing: false }, { id: 18, color: 'black', isKing: false }, { id: 19, color: 'black', isKing: false }, 
//     { id: 20, color: 'black', isKing: false }, { id: 21, color: 'black', isKing: false }, { id: 22, color: 'black', isKing: false }, { id: 23, color: 'black', isKing: false }
// ];


let boardState = [ 
    null, null, null, null,
    null, { id: 32, color: 'red', isKing: false }, null, null,
    null, { id: 32, color: 'black', isKing: false }, { id: 32, color: 'red', isKing: false }, null,
    null, null, null, null,
    null, { id: 32, color: 'red', isKing: false }, null, null,
    null, null, null, null,
    { id: 32, color: 'red', isKing: false }, null, null, null,
    { id: 32, color: 'black', isKing: false }, null, null, null,
];

let squareSelected = [];
let turn = 'black';
let forceJump = false;
let stopMove = false;
let wasLegalClick = false;
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

function checkMove(lastClick) {
    
    const isKingMove = checkKing(lastClick);

    if (squareSelected.length === 1 && boardState[lastClick.id] === null) {

        const isAttackOk = attackOk(lastClick);
        const isNextAttackOk = nextAttackOk(lastClick);

        if (forceJump === false && secondMoveOk(lastClick) && stopMove === false) {
            squareSelected.push(lastClick.id);
            boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
            squareSelected = [];

            if (isKingMove) {
                crownKing(lastClick);
            }

            turn = switchTurn(turn);
            renderBoard();
   
        } else if (forceJump === false && isAttackOk[0]) {
            squareSelected.push(lastClick.id);

            removePiece(isAttackOk[1], boardState);

            boardState = movePiece(squareSelected[0], squareSelected[1], boardState);
            squareSelected = [lastClick.id];
            validAttackMade = true;
            stopMove = true;
            wasLegalClick = true;
            renderBoard();
            
        } else if (isNextAttackOk[0] && isAttackOk[0]) {

            removePiece(isNextAttackOk[1], boardState);

            forceJump = true;
            wasLegalClick = true;
            squareSelected = [lastClick.id];
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
            renderBoard();
        }
    }
    if (firstMoveOk(lastClick)) {
        squareSelected = [lastClick.id];
    }
    wasLegalClick = false;
    checkEndGame();
    console.log(turn);
    console.log(squareSelected);
    console.log(forceJump);
}

function crownKing(lastClick) {

    boardState[lastClick.id].isKing = true;
}

function checkKing(lastClick) {
    return isItemInArray(lastClick.id, kingsRow);
}

function nextMultipleAttackOk(lastClick) {
    
    const possibleNextAttacks = getAttack(lastClick.id);
    const possibleNextKingAttacks = getKingAttack(lastClick.id);

    for (let i = 0; i < possibleNextAttacks.length; i++) {
        
        const currentAttackOption = possibleNextAttacks[i];
        const currentDestination = Number(currentAttackOption.dest);
        const currentJump = Number(currentAttackOption.jump);

        if (isPossibleJumpEmpty(currentDestination) && !isSquareIdEmpty(currentJump)) {
            return true;
        }
    }
    if (boardState[squareSelected[0]] && boardState[squareSelected[0]].isKing) {
        for (let i = 0; i < possibleNextKingAttacks.length; i++) {
        
            const currentAttackOption = possibleNextKingAttacks[i];
            const currentDestination = Number(currentAttackOption.dest);
            const currentJump = Number(currentAttackOption.jump);

            if (isPossibleJumpEmpty(currentDestination) && !isSquareIdEmpty(currentJump)) {
                return true;
            }
        }
    }
    return false;
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

function getKingAttack(id) {
    const redAttacks = redAttacksFrom[id];
    const blackAttacks = blackAttacksFrom[id];
    const kingAttacks = redAttacks.concat(blackAttacks);

    return kingAttacks;
}

function getMoves(color, squareNumber) {
    if (color === 'red') {
        return redMovesFrom[squareNumber];
    }
    return blackMovesFrom[squareNumber];

}

function getKingMoves(squareNumber) {
    const redMoves = redMovesFrom[squareNumber];
    const blackMoves = blackMovesFrom[squareNumber];
    const kingMoves = redMoves.concat(blackMoves);

    return kingMoves;
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

function switchTurn() {
    if (turn === 'red') {
        return 'black';   
    }
    return 'red';
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
        console.log('***GAME OVER, BLACK WINS***');
    }
    if (black === 0) {
        console.log('***GAME OVER, RED WINS***');
    }
}

renderBoard();
setEventListeners();
