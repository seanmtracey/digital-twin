const debug = require('debug')('bin:database');
const Cloudant = require('@cloudant/cloudant');

const cloudant = new Cloudant({ 
    url: process.env.DATABASE_ENDPOINT, 
    plugins: { 
        iamauth: { 
            iamApiKey: process.env.DATABASE_API_KEY
        }
    } 
});

//Edit this variable value to change name of database.
const DEFAULT_DB_NAME = process.env.DEFAULT_DB_NAME;

function writeToDatabase(document, database = DEFAULT_DB_NAME){

    const db = cloudant.db.use(database);

    debug('ADDING DOCUMENT:', document);
    
    return new Promise( (resolve, reject) => {

        db.insert(document, (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });

    });

}

function readFromDatabase(params, database = DEFAULT_DB_NAME){

    const db = cloudant.db.use(database);

    return new Promise( (resolve, reject) => {

        /*const params = {
            "selector": {
               "token": token
            },
            "limit" : 1
        };*/

        db.find( params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.docs[0])
            }
        });

    });

}

function scanDatabase(params, database = DEFAULT_DB_NAME){
    
    const db = cloudant.db.use(database);

    return new Promise( (resolve, reject) => {

        /*const params = {
            "selector": {
                "token": {
                    "$exists": true
                }
            }
        };*/

        db.find( params,(err, results) => {
            
            debug("RESULTS:", results);

            if(err){
                reject(err)
            } else {
                resolve(results.docs);
            }

         });
    });

}

function queryItemsInDatabase(params, database = DEFAULT_DB_NAME){

    const db = cloudant.db.use(database);

    return new Promise( (resolve, reject) => {

        /*const params = {
            "selector": {
                "token": {
                    "$exists": true
                }
            }
        };*/

        db.find( params,(err, results) => {
            
            debug("RESULTS:", results);

            if(err){
                reject(err)
            } else {
                resolve(results.docs);
            }

         });
    });

}

function updateItemInDatabase(document, database = DEFAULT_DB_NAME){

    const db = cloudant.db.use(database);

    debug('UPDATING DOCUMENT:', document);

    return new Promise( (resolve, reject) => {

        db.insert(document, (err, result) => {
            if(err){
                reject(err);
            } else {
                resolve(result);
            }
        });

    });

}

function deleteAnItemFromTheDatabase(document, database = DEFAULT_DB_NAME){

    const db = cloudant.db.use(database);

    debug('DELETING DOCUMENT', document);

    return new Promise( (resolve, reject) => {
        
        db.destroy(document._id, document._rev, (err, body, header) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });

    });

}

module.exports = {
    write    : writeToDatabase,
	read     : readFromDatabase,
	scan     : scanDatabase,
	query    : queryItemsInDatabase,
    update   : updateItemInDatabase,
    delete   : deleteAnItemFromTheDatabase
};