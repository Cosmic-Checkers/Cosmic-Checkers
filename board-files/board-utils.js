export const redMovesFrom = [
    [4, 5], [5, 6], [6, 7], [7],
    [8], [8, 9], [9, 10], [10, 11],
    [12, 13], [13, 14], [14, 15], [15],
    [16], [16, 17], [17, 18], [18, 19],
    [20, 21], [21, 22], [22, 23], [23],
    [24], [24, 25], [25, 26], [26, 27],
    [28, 29], [29, 30], [30, 31], [31],
    [], [], [], [],
];

export const redAttacksFrom = [
    [9], [8, 10], [9, 11], [10],
    [13], [12, 14], [13, 15], [14],
    [17], [16, 18], [17, 19], [18],
    [21], [20, 22], [21, 23], [22],
    [25], [24, 26], [25, 27], [26],
    [29], [28, 30], [29, 31], [30],
    [], [], [], [],
    [], [], [], [],
];

export const blackMovesFrom = [
    [], [], [], [],
    [0], [0, 1], [1, 2], [2, 3],
    [4, 5], [5, 6], [6, 7], [7],
    [8], [8, 9], [9, 10], [10, 11],
    [12, 13], [13, 14], [14, 15], [15],
    [16], [16, 17], [17, 18], [18, 19],
    [20, 21], [21, 22], [22, 23], [23],
    [24], [24, 25], [25, 26], [26, 27]
];

export const blackAttacksFrom = [
    [], [], [], [],
    [], [], [], [],
    [{ dest: 1, jump: 5 }], [{ dest: 0, jump: 5 }, { dest: 2, jump: 6 }], [{ dest: 1, jump: 6 }, { dest: 3, jump: 7 }], [{ dest: 2, jump: 7 }],
    [{ dest: 5, jump: 8 }], [{ dest: 4, jump: 8 }, { dest: 6, jump: 9 }], [{ dest: 5, jump: 9 }, { dest: 7, jump: 10 }], [{ dest: 6, jump: 10 }],
    [{ dest: 9, jump: 13 }], [{ dest: 8, jump: 13 }, { dest: 10, jump: 14 }], [{ dest: 9, jump: 14 }, { dest: 11, jump: 15 }], [{ dest: 10, jump: 15 }],
    [{ dest: 13, jump: 16 }], [{ dest: 12, jump: 16 }, { dest: 14, jump: 17 }], [{ dest: 13, jump: 17 }, { dest: 15, jump: 18 }], [{ dest: 14, jump: 18 }],
    [{ dest: 17, jump: 21 }], [{ dest: 16, jump: 21 }, { dest: 18, jump: 22 }], [{ dest: 17, jump: 22 }, { dest: 19, jump: 23 }], [{ dest: 18, jump: 23 }],
    [{ dest: 21, jump: 24 }], [{ dest: 20, jump: 24 }, { dest: 22, jump: 25 }], [{ dest: 21, jump: 25 }, { dest: 23, jump: 26 }], [{ dest: 22, jump: 26 }]
];

export function isItemInArray(item, array) {
    for (let i = 0; i < array.length; i++) {
        if (Number(item) === array[i]) {
            return true;
        }
        
    }
    
    return false;
}

export function movePiece(squareFrom, squareTo, boardState) {
    const modifiedBoardState = boardState.slice();
    modifiedBoardState[squareTo] = modifiedBoardState[squareFrom];

    removePiece(squareFrom, modifiedBoardState);

    return modifiedBoardState;
}

export function removePiece(square, oldBoardState) {
    oldBoardState[square] = null;
}
