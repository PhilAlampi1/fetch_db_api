'use strict'

const sql = require('../sql').transactionhistory

class TransactionHistoryRepository {
  constructor(db, pgp){
    this.db = db
    this.pgp = pgp
  }


  addTransactionHistoryItem(userToken, formImportId, numFieldsFilled, numFieldsAttempted){
    return this.db.none(sql.addtransaction,[
      userToken, formImportId, numFieldsFilled, numFieldsAttempted
    ])
  }
}

module.exports = TransactionHistoryRepository
