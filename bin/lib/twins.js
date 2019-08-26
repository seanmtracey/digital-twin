const debug = require('debug')('bin:lib:twins');
const uuid = require('uuid').v4;
const database = require(`${__dirname}/database`);
const sanitizeDocument = require(`${__dirname}/sanitize_documents`);

const twinsWhitelistProperties = ['owner', 'nodes', 'settings', 'UUID', 'name', 'created', 'broker', 'modified'];

function getAnExistingTwinWithAnID(UUID){

    return database.read({
            selector : {
                "UUID" : UUID
            }    
        })
        .then(document => {
            return sanitizeDocument(document, twinsWhitelistProperties);
        })
        .catch(err => {
            debug('Database get error:', err);
            throw err;
        })
    ;

}

function updateAnExistingTwinWithAGivenID(UUID, data, user){

    if(!UUID){
        return Promise.reject('No UUID was passed');
    }

    if(!data){
        return Promise.reject(`No data was passed for the twin ${UUID}. The data passed was ${data}.`);
    }

    debug(`Updating twin with UUID ${UUID}`, data);
    
    return database.read({
            "selector": {
                "UUID": UUID
            },
            "limit" : 1
        })
        .then(result => {
            debug('RESULT!', result);

            if(!result){
                throw(`Twin with ${UUID} does not exist`);
            } else if(user !== result.owner){
                throw "User is not able to make edits to this twin.";
            } else { 
                debug('Twin:', result);
                //return Promise.resolve();

                Object.keys(data).forEach(key => {
                    result[key] = data[key];
                });

                return database.update(result);

            }

        })
       .catch(err => {
            debug(err);
            throw err;
        })
    ;

    //return Promise.resolve();

}

function duplicateAnExistingTwinWithAGivenID(UUID, data, user){

    return getAnExistingTwinWithAnID(UUID)
        .then(twin => {

            debug('TWIN TO DUPLICATE:', twin);

            if(twin.owner !== user){
                throw "User can not duplicate a twin that they do not own";
            } else {
                twin.name = data.name;
                return createANewTwin(twin);
            }

        })
        .catch(err => {
            debug(err);
            throw err;
        })
    ;

}

function createANewTwin(data){

    const newTwin = {
        UUID : uuid(),
        name : data.name,
        owner : data.owner,
        broker : data.broker,
        nodes : data.nodes || [],
        settings : data.settings || [],
        created: Date.now() / 1000 | 0
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

function deleteAnExistingTwinWithAGivenID(UUID, user){

    return database.read({
            selector : {
                "UUID" : UUID
            }    
        })
        .then(document => {
            debug('Document to delete:', document);

            if(document.owner !== user){
                throw "User can not delete a twin that they do not own.";
            } else {
                return database.delete(document);
            }

        })
        .catch(err => {
            debug('Delete a twin error:', err);
            throw err;
        })
    ;

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
                
                const sanitizedDocuments = documents.map(uncleanDocument => {return sanitizeDocument(uncleanDocument, twinsWhitelistProperties)});

                return Promise.all(sanitizedDocuments);

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