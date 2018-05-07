'use strict'
const db = require('./db')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))




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


const port = process.env.PORT || 3000
const host = process.env.RDS_HOSTNAME || 'http://localhost'


//TEMP VAR TESTS FROM AWS
console.log("SYSTEM PORT: ", process.env.PORT)
const tempAr = [process.env.RDS_HOSTNAME, process.env.RDS_DB_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD]
for (let i=0; i < tempAr.length; i++) {
  console.log("VALUE: ", tempAr[i])
}
//**** */


app.listen(port, () => {
  console.log('\nReady for GET requests on ' + host + ': ' + port)
})




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

GET('/createform/:name/:description/:public/:usertoken',
  req => db.imports.createForm(req.params.name, req.params.description, req.params.public, req.params.usertoken))

GET('/finduserforms/:usertoken',
  req => db.imports.findUserForms(req.params.usertoken))

GET('/updateForm/:id/:name/:description/:public/:usertoken',
  req => db.imports.updateForm(
    req.params.id,
    req.params.name,
    req.params.description,
    req.params.public,
    req.params.usertoken))

GET('/createupdateuserformfieldmapping/:irid/:formid/:standardfieldid/:formfieldselector/:publicmapping/:defaultvalue/:override/:fieldtype/:usertoken',
  req => db.imports.createUpdateUserFormFieldMapping(
    req.params.irid === 'null' ? null : req.params.irid,
    req.params.formid,
    req.params.standardfieldid === 'null' ? null : req.params.standardfieldid,
    req.params.formfieldselector,
    req.params.publicmapping === 'true' ? true : false,
    req.params.defaultvalue === 'null' ? null : req.params.defaultvalue,
    req.params.override === 'null' ? null : req.params.override,
    req.params.fieldtype === 'null' ? null : req.params.fieldtype,
    req.params.usertoken))

GET('/findformfieldmappings/:formid/:usertoken',
  req => db.imports.findFormFieldMappings(req.params.formid, req.params.usertoken))



