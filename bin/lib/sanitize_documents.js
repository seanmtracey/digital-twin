const debug = require('debug')('bin:lib:sanitize_documents');

module.exports = function(docs, whitelistedProperties){

    return new Promise( (resolve, reject) => {

        if(docs.length === 0){
            reject("There are no documents to sanitize");
        } else {

            const cleanedDocs = docs.map(uncleanDoc => {

                const cleanedDoc = {};

                Object.keys(uncleanDoc).forEach(key => {

                    if(whitelistedProperties.indexOf(key) > -1){
                        cleanedDoc[key] = uncleanDoc[key];
                    }

                });

                return cleanedDoc;

            });

            resolve(cleanedDocs);

        }

    });

};