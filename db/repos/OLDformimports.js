'use strict'

const sql = require('../sql').formimports

class FormImportsRepository {
  constructor(db, pgp){
    this.db = db
    this.pgp = pgp
  }

  findFormImports(token) {
    return this.db.any('SELECT "formImportName", "formImportId" ' +
    'FROM "Form_Imports" ' +
    'WHERE "userToken" = $1',
    token)
  }

  updateFormImports(token, formimportid, rowcategoryimportfield) {
    return this.db.none('UPDATE "Form_Imports" ' +
    'SET "rowCategoryImportField" = $3 ' +
    'WHERE "userToken" = $1 ' +
    'AND "formImportId" = $2',
    [token, formimportid, rowcategoryimportfield])
  }

  // add(firstName, email, password) {
  //   // TODO - validate email is real
  //   // TODO - make user verify email before allowing access
  //   // TODO - ensure duplicate emails cannot be entered (return duplicate error)
  //   return this.db.one(sql.add, [firstName, email, password])
  // }

  addFormImport(token, formImportName, formImportUrl) {
    return this.db.one(sql.addformimport, [token, formImportName, formImportUrl])


    // 'INSERT INTO "Form_Imports"
    //  ("userToken", "formImportName", "formImportUrl")
    //  VALUES ($1, $2, $3)
    //  RETURNING "formImportId"',
    //  [token, formImportName, formImportUrl]

  }
}

module.exports = FormImportsRepository
