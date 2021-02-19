const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');
const util = require('util');

function goodreadsService() {
    function getBookById(id=1) {
    
        return new Promise((resolve, reject) => {
            axios.get('https://6013241a54044a00172dd2cb.mockapi.io/api/v1/books/' + id)
                .then((response) => {
                    debug('Response:' + response.data.description);
                    resolve({description: response.data.description});
                })
                .catch((error) => {
                    reject(error);
                    debug('greads Service ERROR:' + error);
                })
        })
        
    }
    return { getBookById }
}

module.exports = goodreadsService();