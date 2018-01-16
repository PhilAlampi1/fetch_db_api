'use strict'
const moment = require('moment')

class UsersRepository {
  constructor(db, pgp) {
    this.db = db
    this.pgp = pgp
  }
  signInUser(userGoogleId, userFirstName, userEmail, userGoogleToken) {
    return this.db.oneOrNone(
      'UPDATE "Users" ' +
      'SET "lastLogin" = $1 ' +
      'WHERE "userGoogleId" = $2 ' +
      'RETURNING "userId", "userToken"',
      [moment(), userGoogleId])
      .then(result => {
        if (result) {
          return result
        } else {
          return this.db.one(
            'INSERT INTO "Users" ' +
            '("userGoogleId", "userFirstName", "userEmail", "userGoogleToken", "firstLogin", "lastLogin") ' +
            'VALUES($1, $2, $3, $4, $5, $5) ' +
            'RETURNING "userId", "userToken"',
            [userGoogleId, userFirstName, userEmail, userGoogleToken, moment()])
        }
      }).catch((e) => e)
  }
}
module.exports = UsersRepository
