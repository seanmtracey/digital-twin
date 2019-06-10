function getAnExistingTwinWithAnID(UUID){
    return Promise.resolve();
}

function updateAnExistingTwinWithAGivenID(UUID, data){
    return Promise.resolve();
}

function duplicateAnExistingTwinWithAGivenID(UUID, data){
    return Promise.resolve();
}

function createANewTwin(data){
    return Promise.resolve();
}

function deleteAnExistingTwinWithAGivenID(UUID){
    return Promise.resolve();
}

function getAListOfAllOfTheAvailableTwins(){
    return new Promise( (resolve, reject) => {
        resolve();
    } );
}

module.exports = {
    get : getAnExistingTwinWithAnID,
    update : updateAnExistingTwinWithAGivenID,
    duplicate : duplicateAnExistingTwinWithAGivenID,
    create : createANewTwin,
    delete : deleteAnExistingTwinWithAGivenID,
    list : getAListOfAllOfTheAvailableTwins
};