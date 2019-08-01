const debug = require('debug')('bin:lib:twins');
const uuid = require('uuid').v4;
const database = require(`${__dirname}/database`);
const sanitizeDocuments = require(`${__dirname}/sanitize_documents`);

const twinsWhitelistProperties = ['owner', 'nodes', 'settings', 'UUID', 'name', 'created'];

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

    const newTwin = {
        UUID : uuid(),
        name : data.name,
        owner : data.owner,
        nodes : [],
        settings : [],
        created: Date.now() * 1
    };

    return database.write(newTwin)
        .then(result => {
            debug("Twin creation result:", result);
            return newTwin;
        })
        .catch(err => {
            debug("createANewTwinError:", err);
        })
    ;
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

            if(documents.length > 0){
                return sanitizeDocuments(documents, twinsWhitelistProperties);
            } else {
                return [];
            }

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