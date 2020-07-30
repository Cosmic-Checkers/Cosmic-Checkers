// IMPORT MODULES under test here:
// import { example } from '../example.js';
import { isItemInArray, movePiece, getKingMoves } from '../board-files/board-utils.js';

const test = QUnit.test;

test('isitemInArray should take in a number and return true if the number is in the array', (expect) => {
    //Arrange
    // Set up your arguments and expectations
    const expected = true;
    const testArray = [1, 14, 28];
    
    //Act 
    // Call the function you're testing and set the result to a const
    const actual = isItemInArray(14, testArray);

    //Expect
    // Make assertions about what is expected versus the actual result
    expect.equal(actual, expected);
});

test('movePiece should take an array item and exchange it with a null item in the array', (expect) => {
    //Arrange
    // Set up your arguments and expectations
    const expected = [null, 1];
    const testArray = [1, null];
    
    //Act 
    // Call the function you're testing and set the result to a const
    const actual = movePiece(0, 1, testArray);

    //Expect
    // Make assertions about what is expected versus the actual result
    expect.deepEqual(actual, expected);
});

test('getKingMoves should return all possible red and black moves from a square', (expect) => {
    //Arrange
    // Set up your arguments and expectations
    const square = 10;
    
    //Act 
    // Call the function you're testing and set the result to a const
    const actual = getKingMoves(square);
    const expected = [
        14,
        15,
        6,
        7
    ];
    //Expect
    // Make assertions about what is expected versus the actual result
    expect.deepEqual(actual, expected);
});