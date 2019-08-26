const debug = require('debug')('bin:lib:sanitize_documents');

module.exports = function(uncleanDoc, whitelistedProperties){

    return new Promise( (resolve, reject) => {

        if(!uncleanDoc){
            reject("There are no documents to sanitize");
        } else {


            const cleanedDoc = {};

            Object.keys(uncleanDoc).forEach(key => {

                if(whitelistedProperties.indexOf(key) > -1){
                    cleanedDoc[key] = uncleanDoc[key];
                }

            });

            resolve(cleanedDoc);

        }

    });

};