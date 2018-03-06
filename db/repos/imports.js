const updateUserFormFieldMapping = require('./utilities').updateUserFormFieldMapping
const createUserFormFieldMapping = require('./utilities').createUserFormFieldMapping
const setFormFieldsForUpdate = require('./utilities').setFormFieldsForUpdate

class ImportsRespository {
    constructor(db, pgp) {
        this.db = db
        this.pgp = pgp
    }

    getStandardFieldStubData() {
        return this.db.any(
            'SELECT "standardFieldId", "standardFieldName", ' +
            '"standardFieldDescription", "importRowIdentifier"' +
            'FROM "Standard_Field" ' +
            'ORDER BY "standardFieldName"'
        )
    }

    getRowIdentifiersStubData() {
        return this.db.any(
            'SELECT "importRowIdentifierId" as "rowIdentifierId", "identifierName" as "rowIdentifierName", ' +
            '"identifierPrefix" as "rowIdentifierPrefix"' +
            'FROM "Import_Row_Identifier" '
        )
    }

    createImportFileSetup(name, userId, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.one(
                        'INSERT INTO "Import_File_Setup" ' +
                        '("importFileSetupName", "userId") ' +
                        'VALUES ($1, $2) ' +
                        'RETURNING "importFileSetupId"',
                        [name, userId]
                    )
                }
            },
            reason => reason
            )
    }

    findImportFileSetups(id, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.any(
                        'SELECT "importFileSetupId", "importFileSetupName" ' +
                        'FROM "Import_File_Setup" ' +
                        'WHERE "userId" = $1 ',
                        [id]
                    )
                }
            },
            reason => reason
            )
    }

    findImportFieldMappings(importFileSetupId, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.any(
                        'SELECT "Standard_Field"."standardFieldId", "Standard_Field"."standardFieldName", ' +
                        '"Standard_Field"."standardFieldDescription",  "Standard_Field"."importRowIdentifier", ' +
                        '"Import_Field_Mapping"."importedFieldName", "Import_Field_Mapping"."importFieldMappingId" ' +
                        'FROM "Standard_Field" ' +
                        'LEFT JOIN (' +
                        'SELECT "Import_Field_Mapping"."importedFieldName", "Import_Field_Mapping"."standardFieldId", ' +
                        '"Import_Field_Mapping"."importFieldMappingId" ' +
                        'FROM "Import_Field_Mapping"' +
                        'WHERE "Import_Field_Mapping"."importFileSetupId" = $1) AS "Import_Field_Mapping" ' +
                        'ON "Standard_Field"."standardFieldId" = "Import_Field_Mapping"."standardFieldId" ' +
                        'ORDER BY "Standard_Field"."standardFieldId"',
                        [importFileSetupId]
                    )
                }
            },
            reason => reason
            )
    }

    createImportFileMappings(d) {
        const values = (JSON.parse(d.values))
        const userToken = d.userToken
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then(() => {
                const cs = new this.pgp.helpers.ColumnSet(['userId', 'importFileSetupId', 'standardFieldId', 'importedFieldName'],
                    { table: 'Import_Field_Mapping' })
                const query = this.pgp.helpers.insert(values, cs)
                return this.db.none(query)
            },
            reason => reason
            )
    }

    updateImportFieldMappings(d) {
        const values = (JSON.parse(d.values))
        const userToken = d.userToken
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then(() => {
                const cs = new this.pgp.helpers.ColumnSet(['?importFieldMappingId', 'importedFieldName'],
                    { table: 'Import_Field_Mapping' })
                const query = this.pgp.helpers.update(values, cs) + ' WHERE "v"."importFieldMappingId" = "t"."importFieldMappingId"'
                return this.db.none(query)
            },
            reason => reason
            )
    }

    updateImportFileSetupName(id, userToken, name) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.any(
                        'UPDATE "Import_File_Setup" ' +
                        'SET "importFileSetupName" = $1' +
                        'WHERE "userId" = $2 ' +
                        'AND "importFileSetupId" = $3',
                        [name, result.userId, id]
                    )
                }
            },
            reason => reason
            )
    }

    createForm(formName, formDescription, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.one(
                        'INSERT INTO "Form" ' +
                        '("formName", "formDescription", "userId") ' +
                        'VALUES ($1, $2, $3) ' +
                        'RETURNING "formId"',
                        [formName, formDescription, result.userId]
                    )
                }
            },
            reason => reason
            )
    }

    findUserForms(userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.any(
                        'SELECT "formId", "formName", "formDescription", "public" ' +
                        'FROM "Form" ' +
                        'WHERE "userId" = $1 OR "public" = true',
                        [result.userId]
                    )
                }
            },
            reason => reason
            )
    }

    updateForm(formId, formName, formDescription, publicForm, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.any(
                        'UPDATE "Form" ' +
                        'SET "formName" = $1, "formDescription" = $2, "public" = $5' +
                        'WHERE "userId" = $3 ' +
                        'AND "formId" = $4',
                        [formName, formDescription, result.userId, formId, publicForm]
                    )
                }
            },
            reason => reason
            )
    }

    createUpdateUserFormFieldMapping(irId, formId, standardFieldId, formFieldSelector, publicMapping, defaultValue, override, fieldType, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId", "userRole" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken])
            .then((result) => {
                // console.log('publicMapping', publicMapping)
                if (result.userId) { // user exists
                    if (publicMapping == true && result.userRole !== 'ADMIN') {
                        throw ('Only ADMIN users may update public mappings.')
                    }
                    if (publicMapping == false) { // this is a user (private) mapping
                        return this.db.any( // check if private record already exists
                            'SELECT "userFormFieldMappingId", "importRowIdentifierId", "standardFieldId", "defaultValue", "overrideImportWithDefault" ' +
                            'FROM "User_Form_Field_Mapping" ' +
                            'WHERE "publicMapping" = false ' +
                            'AND "formFieldSelector" = $1 ' +
                            'AND "formId" = $2 ' +
                            'AND "createdByUserId" = $3',
                            [formFieldSelector, formId, result.userId])
                            .then((result2) => {
                                // console.log('result2', result2[0])
                                if (result2[0] && result2[0].userFormFieldMappingId) { // there is an existing record, so update it
                                    const uVals = setFormFieldsForUpdate(irId, standardFieldId, defaultValue, override, result2[0])
                                    const updateIrId = uVals[0], updateStandardFieldId = uVals[1], updateDefaultValue = uVals[2], updateOverride = uVals[3]
                                    updateUserFormFieldMapping( 
                                        updateIrId, updateStandardFieldId, result2[0].userFormFieldMappingId, updateDefaultValue, updateOverride, fieldType, this.db
                                    )
                                } else { // no existing record, so insert
                                    createUserFormFieldMapping( 
                                        result.userId, formId, standardFieldId, formFieldSelector, irId, publicMapping, defaultValue, override, fieldType, this.db
                                    )
                                }
                            })
                    } else { // this is a public mapping
                        return this.db.any( // check if public record exists
                            'SELECT "userFormFieldMappingId", "importRowIdentifierId", "standardFieldId", "defaultValue", "overrideImportWithDefault" ' +
                            'FROM "User_Form_Field_Mapping" ' +
                            'WHERE "publicMapping" = true ' +
                            'AND "formFieldSelector" = $1 ' +
                            'AND "formId" = $2',
                            [formFieldSelector, formId])
                            .then((result3) => {
                                // console.log('result3', result3[0])
                                if (result3[0] && result3[0].userFormFieldMappingId) { // there is an existing record, so update it
                                    const uVals = setFormFieldsForUpdate(irId, standardFieldId, defaultValue, override, result3[0])
                                    const updateIrId = uVals[0], updateStandardFieldId = uVals[1], updateDefaultValue = uVals[2], updateOverride = uVals[3]
                                    updateUserFormFieldMapping( 
                                        updateIrId, updateStandardFieldId, result3[0].userFormFieldMappingId, updateDefaultValue, updateOverride, fieldType, this.db
                                    )
                                } else { // no existing record, so insert
                                    createUserFormFieldMapping( 
                                        result.userId, formId, standardFieldId, formFieldSelector,
                                        irId, publicMapping, defaultValue, override, fieldType, this.db
                                    )
                                }
                            })
                    }
                }
            },
            reason => reason
            )
    }

    findFormFieldMappings(formId, userToken) {
        return this.db.oneOrNone(
            'SELECT "userId" ' +
            'FROM "Users" ' +
            'WHERE "userToken" = $1 ',
            [userToken]).then((result) => {
                if (result.userId) {
                    return this.db.any(
                        'SELECT "standardFieldId", "importRowIdentifierId", "formFieldSelector", "defaultValue", "overrideImportWithDefault", "formFieldType" ' +
                        'FROM "User_Form_Field_Mapping" ' +
                        'WHERE "createdByUserId" = $1 ' +
                        'AND "publicMapping" = false ' +
                        'AND "formId" = $2 ' +
                        'UNION ' +
                        'SELECT "standardFieldId", "importRowIdentifierId", "formFieldSelector", "defaultValue", "overrideImportWithDefault", "formFieldType" ' +
                        'FROM "User_Form_Field_Mapping" ' +
                        'WHERE "publicMapping" = true ' + 
                        'AND "formId" = $2 ' +
                        'AND "formFieldSelector" NOT IN (' +
                            'SELECT "formFieldSelector" ' +
                            'FROM "User_Form_Field_Mapping" ' +
                            'WHERE "createdByUserId" = $1 ' +
                            'AND "publicMapping" = false ' +
                            'AND "formId" = $2 ' +
                            'AND "formFieldSelector" IS NOT NULL)',
                        [result.userId, formId]
                    )
                }
            },
            reason => reason
            )
            .catch((reason) => console.log(reason))
    }
}

module.exports = ImportsRespository