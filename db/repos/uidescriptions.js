'use strict'

class UIDescriptionsRepository {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
  }

  findUIDescriptions(screenId) {
    return this.db.any(
      'SELECT "descriptionUIFieldId", "descriptionMessage" ' + 
      ' FROM "UI_Descriptions" WHERE "descriptionScreenId" = $1', screenId)
    }

}

module.exports = UIDescriptionsRepository
