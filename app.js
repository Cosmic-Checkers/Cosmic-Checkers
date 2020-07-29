// import functions and grab DOM elements
const inputForm = document.getElementById('input-form');
// initialize state

// set event listeners to update state and DOM

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.location = '../board-files/board.html';
    
});