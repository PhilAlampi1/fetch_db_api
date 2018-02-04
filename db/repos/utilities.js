const updateUserFormFieldMapping = (irId, standardFieldId, userFormFieldMappingId, db) => {
    return db.any(
        'UPDATE "User_Form_Field_Mapping" ' +
        'SET "importRowIdentifierId" = $1, "standardFieldId" = $2 ' +
        // '"defaultValue" = $3, "overrideImportWithDefault" = $4' +
        'WHERE "userFormFieldMappingId" = $3',
        [irId, standardFieldId, userFormFieldMappingId] //, defaultValue, override
    )
}

const createUserFormFieldMapping = (userId, formId, standardFieldId, formFieldSelector, irId, publicMapping, db) => {
    return db.one(
        'INSERT INTO "User_Form_Field_Mapping" ' +
        '("createdByUserId", "formId", "standardFieldId", "formFieldSelector", ' +
        '"importRowIdentifierId", "publicMapping") ' + //"defaultValue", "overrideImportWithDefault", 
        'VALUES ($1, $2, $3, $4, $5, $6) ' +
        'RETURNING "userFormFieldMappingId"',
        [userId, formId, standardFieldId, formFieldSelector, irId, publicMapping]
    )
}

module.exports.updateUserFormFieldMapping = updateUserFormFieldMapping
module.exports.createUserFormFieldMapping = createUserFormFieldMapping