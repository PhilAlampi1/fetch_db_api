'use strict'

class FormImportMappingsRepository {
  constructor(db, pgp){
    this.db = db
    this.pgp = pgp
  }

  getFormImportMappings(token, formImportId) {
    return this.db.any('SELECT "importField", "fieldSelector", ' +
    '"defaultValue", "overrideValueWithDefault" ' +
    'FROM "Form_Import_Mappings" ' +
    'WHERE "userToken" = $1 AND "formImportId" = $2',
    [token, formImportId])
  }

  getFormImportMapping(token, formImportId, fieldSelector) {
    return this.db.any('SELECT "importField", ' +
    '"defaultValue", "overrideValueWithDefault" ' +
    'FROM "Form_Import_Mappings" ' +
    'WHERE "userToken" = $1 ' +
    'AND "formImportId" = $2 ' +
    'AND "fieldSelector" = $3',
    [token, formImportId, fieldSelector])
  }

  addFormImportMapping(n){
    return this.db.none('INSERT INTO "Form_Import_Mappings" ' +
    '("userToken", "formImportId", "fieldSelector", "importField", "defaultValue", "overrideValueWithDefault") ' +
    'VALUES (${userToken}, ${formImportId}, ${fieldSelector}, ${importField}, ' +
    '${defaultValue}, ${overrideValueWithDefault})',
    n)
  }

  deleteFormImportMapping(token, formImportId, fieldSelector){
    return this.db.none('DELETE FROM "Form_Import_Mappings" ' +
    'WHERE "userToken" = $1 ' +
    'AND "formImportId" = $2' +
    'AND "fieldSelector" = $3',
    [token, formImportId, fieldSelector])
  }

}

module.exports = FormImportMappingsRepository
