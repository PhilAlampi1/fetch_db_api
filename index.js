'use strict'
const db = require('./db')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/* DATABASE CALLS */

GET('/standardfieldsstub',
  req => db.imports.getStandardFieldStubData())

GET('/rowidentifiersstub',
  req => db.imports.getRowIdentifiersStubData())

GET('/signin/:googleid/:name/:email/:googletoken',
  req => db.users.signInUser(req.params.googleid,
    req.params.name,
    req.params.email,
    req.params.googletoken))

GET('/createimportfilesetup/:name/:userid/:usertoken',
  req => db.imports.createImportFileSetup(req.params.name, req.params.userid, req.params.usertoken))

GET('/findimportfilesetups/:id/:usertoken',
  req => db.imports.findImportFileSetups(req.params.id, req.params.usertoken))

GET('/findimportfieldmappings/:importfilesetupid/:usertoken',
  req => db.imports.findImportFieldMappings(req.params.importfilesetupid, req.params.usertoken))

POST('/importfilemappings/add',
  req => db.imports.createImportFileMappings(req.body))

POST('/importfieldmappings/update',
  req => db.imports.updateImportFieldMappings(req.body))

  GET('/updateimportfilesetupname/:id/:usertoken/:name',
  req => db.imports.updateImportFileSetupName(req.params.id, req.params.usertoken, req.params.name))


// GET('/users/find/:email/:password',
// req => db.users.findTokenByEmailPassword(req.params.email, req.params.password))

// GET('/users/add/:firstname/:email/:password',
// req => db.users.addNewUser(req.params.firstname, req.params.email, req.params.password))

// GET('/descriptions/find/:screenid',
// req => db.uidescriptions.findUIDescriptions(req.params.screenid))

// GET('/formimports/find/:usertoken',
// req => db.formimports.findFormImports(req.params.usertoken))

// GET('/formimports/add/:token/:name/:url',
// req => db.formimports.addFormImport(req.params.token, req.params.name, req.params.url))

// GET('/formimportrowcategories/find/:token/:formimportid',
// req => db.formimportrowcategories.getFormImportRowCategories(req.params.token, req.params.formimportid))

// GET ('/formimportmappings/find/:token/:formimportid',
// req => db.formimportmappings.getFormImportMappings(req.params.token, req.params.formimportid))

// GET ('/transactions/add/:token/:formImportId/:numFieldsFilled/:numFieldsAttempted',
// req => db.transactionhistory.addTransactionHistoryItem(
//   req.params.token, req.params.formImportId,
//   req.params.numFieldsFilled, req.params.numFieldsAttempted
// ))

// GET ('/formimportmapping/find/:token/:formimportid/:fieldSelector',
// req => db.formimportmappings.getFormImportMapping(
//   req.params.token, req.params.formimportid, req.params.fieldSelector
// ))

// GET('/formimports/update/:token/:formimportid/:rowcategoryimportfield',
// req => db.formimports.updateFormImports(
//   req.params.token, req.params.formimportid, req.params.rowcategoryimportfield
// ))

// POST('/formimportrowcategories/add',
// req => db.formimportrowcategories.addFormImportRowCategories(req.body.newCategories))

// GET('/formimportrowcategories/remove/:usertoken/:formimportid',
// req => db.formimportrowcategories.deleteFormImportRowCategories(
//   req.params.usertoken, req.params.formimportid
// ))

// POST('/formimportmapping/add',
// req => db.formimportmappings.addFormImportMapping(req.body))

// GET('/formimportmapping/remove/:usertoken/:formimportid/:fieldselector',
// req => db.formimportmappings.deleteFormImportMapping(
//   req.params.usertoken, req.params.formimportid, req.params.fieldselector
// ))


/* UTILITY FUNCTIONS */

function POST(url, handler) {
  app.post(url, (req, res) => {
    handler(req)
      .then(data => {
        res.json({
          success: true,
          data
        })
      })
      .catch(error => {
        res.json({
          success: false,
          error: error.message || error
        })
      })
  })
}

function GET(url, handler) {
  app.get(url, (req, res) => {
    handler(req)
      .then(data => {
        res.json({
          success: true,
          data
        })
      })
      .catch(error => {
        res.json({
          success: false,
          error: error.message || error
        })
      })
  })
}


/* CONNETION INFO */

const port = 3000

app.listen(port, () => {
  console.log('\nReady for GET requests on http://localhost:' + port)
})
