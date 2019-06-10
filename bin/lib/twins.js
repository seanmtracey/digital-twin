const debug = require('debug')('bin:lib:twins');
const database = require(`${__dirname}/database`);
const sanitizeDocuments = require(`${__dirname}/sanitize_documents`);

const twinsWhitelistProperties = ['owner', 'nodes', 'settings', 'UUID', 'name'];

function getAnExistingTwinWithAnID(UUID){

    return database.read({
            selector : {
                "UUID" : UUID
            }    
        })
        .then(document => {
            return sanitizeDocuments([document], twinsWhitelistProperties);
        })
        .catch(err => {
            debug('Database get error:', err);
            throw err;
        })
    ;

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
            return sanitizeDocuments(documents, twinsWhitelistProperties);
        })
        .catch(err => {
            debug("Database scan error:", err);
            throw err;
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