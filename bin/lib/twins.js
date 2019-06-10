const debug = require('debug')('bin:lib:twins');
const database = require(`${__dirname}/database`);
const sanitizeDocuments = require(`${__dirname}/sanitize_documents`);

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
    
    const scanParameters = {
        "selector": {
            "UUID": {
                "$exists": true
            }
        }
    };
    
    return database.scan(scanParameters)
        .then(documents => {
            return sanitizeDocuments(documents, ['owner', 'nodes', 'settings', 'UUID', 'name'])
        })
        .catch(err => {
            debug("Database scan error:", err);
        })
    ;
}

module.exports = {
    get : getAnExistingTwinWithAnID,
    update : updateAnExistingTwinWithAGivenID,
    duplicate : duplicateAnExistingTwinWithAGivenID,
    create : createANewTwin,
    delete : deleteAnExistingTwinWithAGivenID,
    list : getAListOfAllOfTheAvailableTwins
};