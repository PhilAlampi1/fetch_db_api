-- INSERT INTO "Users" ("userFirstName", "userEmail", "userPassword")
-- VALUES($1, $2, $3)
-- RETURNING "userToken"

INSERT INTO "Form_Imports" ("userToken", "formImportName", "formImportUrl")
VALUES ($1, $2, $3)
RETURNING "formImportId"
