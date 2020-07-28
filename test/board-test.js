// IMPORT MODULES under test here:
// import { example } from '../example.js';
import { isItemInArray } from '../board-files/board-utils.js';

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
