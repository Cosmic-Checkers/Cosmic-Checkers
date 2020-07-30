const MAGICKEY = 'CHECKERSDATA';

export function saveToLocalStorage(dataToSave) {


    const stringyData = JSON.stringify(dataToSave);
    localStorage.setItem(MAGICKEY, stringyData);
}

export function loadFromLocalStorage() {
    const stringyData = localStorage.getItem(MAGICKEY);
    const data = JSON.parse(stringyData);
    return data;
}

export function randomizer() {
    const randomNumber = Math.floor(Math.random() * 2);
    if (randomNumber === 0) {
        return ['black', 'red'];
    }
    return ['red', 'black'];
} 
