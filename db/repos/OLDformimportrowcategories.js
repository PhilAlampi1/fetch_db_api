'use strict'

class FormImportRowCategoriesRepository {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  getFormImportRowCategories(token, formImportId){
    return this.db.any('SELECT "categoryName", "categoryCode" ' +
    'FROM "Form_Import_Row_Categories" ' +
    'WHERE "userToken" = $1 AND "formImportId" = $2',
    [token, formImportId])
  }

  addFormImportRowCategories(newCategories){
    /* Send newCategories in this format:
    [{"userToken": "cfe8fec5-2289-41e0-a31e-9919104720ca", "formImportId": "bc121c4d-cac5-4090-aaaa-79baefccd663","categoryName": "Poopydoo1", "categoryCode": "PD1"},
    {"userToken": "cfe8fec5-2289-41e0-a31e-9919104720ca", "formImportId": "bc121c4d-cac5-4090-aaaa-79baefccd663","categoryName": "Poopydoo2", "categoryCode": "PD2"},
    {"userToken": "cfe8fec5-2289-41e0-a31e-9919104720ca", "formImportId": "bc121c4d-cac5-4090-aaaa-79baefccd663","categoryName": "Poopydoo3", "categoryCode": "PD3"},
    {"userToken": "cfe8fec5-2289-41e0-a31e-9919104720ca", "formImportId": "bc121c4d-cac5-4090-aaaa-79baefccd663","categoryName": "Poopydoo4", "categoryCode": "PD4"}]
    */
    return this.db.task(function (t) {
      let queries = []
      let cArray = JSON.parse(newCategories)
      cArray.forEach(function (data) {
        queries.push(t.none('INSERT INTO "Form_Import_Row_Categories" ' +
        '("userToken", "formImportId", "categoryName", "categoryCode")' +
        'VALUES (${userToken}, ${formImportId}, ${categoryName}, ${categoryCode})',
        data))
      })
      return t.batch(queries) // settles all queries
    })
  }

  deleteFormImportRowCategories(token, formImportId){
    return this.db.none('DELETE FROM "Form_Import_Row_Categories" ' +
    'WHERE "userToken" = $1 ' +
    'AND "formImportId" = $2',
    [token, formImportId])
  }

}

module.exports = FormImportRowCategoriesRepository
