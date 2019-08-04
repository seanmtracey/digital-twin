const debug = require('debug')('bin:lib:twins');
const uuid = require('uuid').v4;
const database = require(`${__dirname}/database`);
const sanitizeDocuments = require(`${__dirname}/sanitize_documents`);

const twinsWhitelistProperties = ['owner', 'nodes', 'settings', 'UUID', 'name', 'created'];

function getAnExistingTwinWithAnID(UUID, user){

    if(!UUID){
        return Promise.reject(`No UUID passed to retrieve Digital Twin by.`);
    }

    if(!user){
        return Promise.reject(`The user ID of the owner of the Digital Twin was not passed for retrieval`);
    }

    return database.read({
            selector : {
                "UUID" : UUID
            }    
        })
        .then(document => {
            debug('DOCUMENT:', document);

            if(document.owner !== user){
                throw 'Digital Twin does not belong to user that requested to view it.';
            }

            return sanitizeDocuments([document], twinsWhitelistProperties);
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
                throw(`Twin with ${UUID} does not exist.`);
            } else if(user !== result.owner){
                throw `Twin ${UUID} does not belong to ${user}. This user is not able to make edits to this twin.`;
            } else { 
                debug('Twin:', result);

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

}

function duplicateAnExistingTwinWithAGivenID(UUID, data, user){
    return Promise.resolve();
}

function createANewTwin(data){

    if(!data){
        return Promise.reject(`No data passed to created Digital Twin`);
    }

    const requiredData = ['name', 'owner'];
    const missingKeys = Object.keys(requiredData).map(key => {
        if(!data[key]){
            return key;
        } else {
            return null;
        }
    }).filter(key => { return key !== null; });

    debug(missingKeys);

    if(missingKeys.length > 0){
        return Promise.reject( `Missing properties required for Digital Twin creation: '${missingKeys.join(`', '`)}'` );
    }

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

function deleteAnExistingTwinWithAGivenID(UUID, user){

    if(!UUID){
        return Promise.reject(`No UUID was passed to identify which Digital Twin to delete`);
    }

    if(!user){
        return Promise.reject(`No user ID was passed to determine whether or not the user is allowed to delete the twin with UUID ${UUID}`);
    }

    return database.read({
            selector : {
                "UUID" : UUID
            }    
        })
        .then(result => {

            debug(`Get Document for deletion:`, result);

            if(!result){
                throw `Twin with UUID ${UUID} does not exist`;
            } else if(result.owner !== user){
                throw `Twin ${UUID} does not belong to ${user}. This user is not able to delete this twin.`;
            } else {
                return database.delete(result);
            }

        })
        .catch(err => {
            debug('Delete Err:', err);
            throw err;
        })

    ;

    //return Promise.resolve();
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