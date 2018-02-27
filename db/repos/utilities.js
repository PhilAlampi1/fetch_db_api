const updateUserFormFieldMapping = (irId, standardFieldId, userFormFieldMappingId, defaultValue, override, fieldType, db) => {
    return db.any(
        'UPDATE "User_Form_Field_Mapping" ' +
        'SET "importRowIdentifierId" = $1, "standardFieldId" = $2, ' +
        '"defaultValue" = $3, "overrideImportWithDefault" = $4 , "formFieldType" = $5 ' +
        'WHERE "userFormFieldMappingId" = $6',
        [irId, standardFieldId, defaultValue, override, fieldType, userFormFieldMappingId]
    )
}

const createUserFormFieldMapping = (userId, formId, standardFieldId, formFieldSelector, irId, publicMapping, defaultValue, override, fieldType, db) => {
    return db.one(
        'INSERT INTO "User_Form_Field_Mapping" ' +
        '("createdByUserId", "formId", "standardFieldId", "formFieldSelector", ' +
        '"importRowIdentifierId", "publicMapping", "defaultValue", "overrideImportWithDefault", "formFieldType") ' + 
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ' +
        'RETURNING "userFormFieldMappingId"',
        [userId, formId, standardFieldId, formFieldSelector, irId, publicMapping, defaultValue, override, fieldType]
    )
}

module.exports.updateUserFormFieldMapping = updateUserFormFieldMapping
module.exports.createUserFormFieldMapping = createUserFormFieldMapping