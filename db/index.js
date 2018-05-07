'use strict'
const promise = require('bluebird')

// Loading all the database repositories separately,
// because event 'extend' is called multiple times:
const repos = {
    users: require('./repos/users'),
    uidescriptions: require('./repos/uidescriptions'),
    imports: require('./repos/imports')
}

// pg-promise initialization options:
const options = {

    // Use a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,

    // Extending the database protocol with our custom repositories
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend: (obj, dc) => {
        // Database Context (dc) is only needed when extending multiple databases.

        // Do not use 'require()' here, because this event occurs for every task
        // and transaction being executed, which should be as fast as possible.
        obj.users = new repos.users(obj, pgp)
        obj.uidescriptions = new repos.uidescriptions(obj, pgp)
        obj.imports = new repos.imports(obj, pgp)

        // Alternatively, you can set all repositories in a loop:
        //
        // for (let r in repos) {
        //    obj[r] = new repos[r](obj, pgp)
        // }
    }

}

// Database connection parameters:

// DEVELOPMENT
// const config = {
//     host: 'localhost',
//     port: 5432,
//     database: 'fetch-dev',
//     user: 'postgres',
//     password: 'P0stgres1tup123'
// }

// PRODUCTION



const config = {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD
}


// PRODUCTION ATTEMPT - DIDN'T WORK
// const config = {
//     host: 'fetchawsinstance.ccukbb8dxn6o.us-east-2.rds.amazonaws.com',
//     port: 5432,
//     database: 'fetchProd',
//     user: 'MrBrushly',
//     password: 'Brush1tup',
//     ssl : {
//         rejectUnauthorized : false,
//         ca   : fs.readFileSync("/path/to/server-certificates/maybe/root.crt").toString(),
//         key  : fs.readFileSync("/path/to/client-key/maybe/postgresql.key").toString(),
//         cert : fs.readFileSync("/path/to/client-certificates/maybe/postgresql.crt").toString(),
//       }
// }


// Load and initialize pg-promise:
const pgp = require('pg-promise')(options)

// Create the database instance:
const db = pgp(config)

// Load and initialize optional diagnostics:
const diagnostics = require('./diagnostics')
diagnostics.init(options)

// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
module.exports = db
