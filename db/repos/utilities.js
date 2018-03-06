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

const setFormFieldsForUpdate = (irId, standardFieldId, defaultValue, override, resultSet) => {
    // Create update values to handle cases where:
    // 1 - The irId and standardFieldId fields should NOT updated (e.g. call is from a default mapping action in the extension)
    // OR
    // 2 - The defaultValue and overrid fields should NOT be updated (e.g. call if from a form mapping action in the extension) 
    let updateIrId, updateStandardFieldId, updateDefaultValue, updateOverride
    if (!standardFieldId) {
        updateIrId = resultSet.importRowIdentifierId
        updateStandardFieldId = resultSet.standardFieldId
        updateDefaultValue = defaultValue
        updateOverride = override
    } else {
        updateIrId = irId
        updateStandardFieldId = standardFieldId
        updateDefaultValue = resultSet.defaultValue
        updateOverride = resultSet.overrideImportWithDefault
    }
    return [updateIrId, updateStandardFieldId, updateDefaultValue, updateOverride]
}

module.exports.updateUserFormFieldMapping = updateUserFormFieldMapping
module.exports.createUserFormFieldMapping = createUserFormFieldMapping
module.exports.setFormFieldsForUpdate = setFormFieldsForUpdate