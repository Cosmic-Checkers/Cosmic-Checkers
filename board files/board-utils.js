export function setPiece(color, coordinate) {
    //stuff
}

export function clearBoard() {
    //stuff
}

export function findById(array, squareId) {
    for (let i = 0; i < array.length; i++) {
        const currentArrayItem = array[i];
        if (currentArrayItem === squareId) {
            //stuff
        }
    }
}


export const blackStartingPositions = [
    'sq20',
    'sq22',
    'sq24',
    'sq26',
    'sq11',
    'sq13',
    'sq15',
    'sq17',
    'sq00',
    'sq02',
    'sq04',
    'sq06'
];

export const redStartingPositions = [
    'sq71',
    'sq73',
    'sq75',
    'sq77',
    'sq60',
    'sq62',
    'sq64',
    'sq66',
    'sq51',
    'sq53',
    'sq55',
    'sq57'
];