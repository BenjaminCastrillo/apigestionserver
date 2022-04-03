const valErrors = require('./valerrors');
const pgErrors = require('./pgerrors');
const sysErrors = require('./syserrors');
const funcErrors = require('./funcerrors');


module.exports.createPgError = pgErrors.PgError;
module.exports.createValidationError = valErrors.ValidationError;
module.exports.createSysError = sysErrors.SysError;
module.exports.createFuncError = funcErrors.FuncError;