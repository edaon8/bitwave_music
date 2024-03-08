// Get an instance of mysql we can use in the app
var mysql = require('mysql')
var mariadb = require('mariadb');

// var pool = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'classmysql.engr.oregonstate.edu',
//     user            : 'cs340_daone',
//     password        : 'tdwvK71tyjza',
//     database        : 'cs340_daone'
// })

const pool = mariadb.createPool({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_daone',
    password: 'tdwvK71tyjza',
    database: 'cs340_daone',
    connectionLimit: 10
});

module.exports = pool;

// Export it for use in our applicaiton
// module.exports.pool = pool;