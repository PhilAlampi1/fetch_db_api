class ImportsRespository {
    constructor(db, pgp) {
        this.db = db
        this.pgp = pgp
    }

    getStandardFieldStubData() {
        return this.db.any(
            'SELECT "standardFieldId", "standardFieldName", ' +
            '"standardFieldDescription", "importRowIdentifier"' +
            'FROM "Standard_Field"')
    }

    getRowIdentifiersStubData() {
        return this.db.any(
            'SELECT "importRowIdentifierId" as "rowIdentifierId", "identifierName" as "rowIdentifierName", ' +
            '"identifierPrefix" as "rowIdentifierPrefix"' +
            'FROM "Import_Row_Identifier"')
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

    updateImportFileSetupName (id, userToken, name) {
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

    // UPDATE table_name
    // SET column1 = value1, column2 = value2, ...
    // WHERE condition;

}

module.exports = ImportsRespository