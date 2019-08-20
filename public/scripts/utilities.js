const utilities = (function(){

    function generateRandomID(length = 8){

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-abcdefghijklmnopqrstuvwxyz0123456789";
        const code = [];
        let remainingCharacters = length;

        while(remainingCharacters > 0){

            code.push( characters[ Math.random() * characters.length | 0 ] );

            remainingCharacters -= 1;

        }

        return code.join('');

    }

    function getPropertyFromObjectWithStringOfDotNotation(str, obj){

        return str.split('.').reduce((obj,i) => { return obj[i]; }, obj);

    }

    return {
        uuid : generateRandomID,
        getProperty : getPropertyFromObjectWithStringOfDotNotation
    }
    
})();