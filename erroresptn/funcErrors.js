
/**********************************
*
*   Errores funcionales
*
***********************************/

var util = require('util');

var functionalErrorNames = {
        genericError: { errorCode: 0, message: 'Functional error'},
        validationError: { errorCode: 1, message: 'Validation error'},
        userAlreadyExists: { errorCode: 2, message: 'User already exists'},
        userNoExists: { errorCode: 3, message: 'User doesnt exists'},
        userNotActive: { errorCode: 4, message: 'User is not active'},
        badCredentials: { errorCode: 5, message: 'Bad login credentials'},
        tokenNoExists:  { errorCode: 6, message: 'Token doesnt exists'},
        invalidAccessToken: { errorCode: 7, message: 'Could not verify user access token'} ,
        paymentNoExists:  { errorCode: 8, message: 'Payment doesnt exists'},
        couponNoExists:  { errorCode: 9, message: 'Coupon doesnt exists', critical:true},
        couponExpired: { errorCode: 10, message: 'Coupon expried'},
        couponAlreadyUsed: { errorCode: 11, message: 'Coupon already consumed'},
        eplayNoExists: { errorCode: 12, message: 'Eplay doesnt exists' },
        invoicingDataNoExists: {errorCode: 13, message: 'Invocing data doesnt exist' },
        templateNoExists: {errorCode: 14, message: 'Template doesnt exists' },
        templateJSMissing: { errorCode:15, message:'Template template.js file is missing', critical:true },
        allTemplateFilesAreNotPNG: { errorCode:16, message:'Template files must be all PNG images excepting template.js' },
        contentNoExists: { errorCode:17, message:'Content doesnt exists' },
        catalogsNoExists: { errorCode:17, message:'Catalogs doesnt exists' },
        fileNoExists: {errorCode: 18, message: 'File no exists' },
        imageProcessingError: {errorCode: 19, message: 'Image could not be processed', critical:true },
        imageFormatNotSupported: {errorCode: 20, message: 'Image format is not supported' },
        imageIsTooBig: {errorCode: 21, message: 'Image exceeds maximum size' },
        videoProcessingError: {errorCode: 22, message: 'Video could not be processed', critical:true },
        videoFormatNotSupported: {errorCode: 23, message: 'Video format is not supported' },
        videoExceedsMaxSize: {errorCode: 24, message: 'Video exceeds maximum size' },
        videoExceedsMaxDuration: {errorCode: 25, message: 'Video exceeds maximum duration' },
        userIsUnder18: { errorCode:26, message: 'User age is under 18'},
        rejectedPermissions: { errorCode:27, message:'User did not provide FB permissions'},
        fbLoginNotAvailable: { errorCode:28, message:'Facebook login is currently unavailable' },
        transactionNoExists:  { errorCode: 29, message: 'Transaction doesnt exists'},
        campaignNoExists:  { errorCode: 30, message: 'Campaign doesnt exists'},
        contentDurationLessThanMin: { errorCode: 31, message: 'Content duration must be 10 or more'},
        contentExceedsMaxDuration: { errorCode: 32, message: 'Content duration must be less than 24h'},
        missingProductImages: { errorCode:33, message:'Product requires main and price images for all locales' },
        playlistNoExists: { errorCode:34, message:'Playlist doesnt exists' },
        playlistExceedsMaxDuration: { errorCode:35, message:'Playlist duration must be less than 24h' },
        roleNoExists: { errorCode: 36, message: 'Role doesnt exists'},
        userHasNoRole: { errorCode: 37, message: 'User has no role'},
        applicationNoExists: { errorCode: 38, message: 'Application doesnt exists'},
        campaignAlreadyCompleted: { errorCode: 39, message: 'Campaign already completed', critical:true},
        promoNoExists: { errorCode: 40, message: 'Promotion no exists'},
        permissionRoleApplicationNoMatch: { errorCode: 41, message: 'Permission and role applications does not match'},
        permissionAlreadyAssigned: { errorCode: 42, message: 'Permission is already assigned to the role'},
        permissionNoExists: { errorCode: 43, message: 'Permission doesnt exists'},
        notEnoughBalance: { errorCode: 44, message: 'Not enough balance'},
        campaignInconsistenState: { errorCode: 45, message: 'Current campaign is in an inconsisten state', critical:true},
        campaignHasNoAvailability: { errorCode: 46, message: 'Current campaign has no slots available'},
        contentInActiveCampaign: {errorCode:47, message:'Content is assigned to active campaigns'},
        captchaFailed: { errorCode: 48, message: 'Captcha validation failed'},
        twLoginNotAvailable: { errorCode:49, message:'Twitter login is currently unavailable' },
        gLoginNotAvailable: { errorCode:50, message:'Google login is currently unavailable' },
        lnLoginNotAvailable: { errorCode:51, message:'Linkedin login is currently unavailable' },
        failedLoginAttemptsMax: { errorCode:52, message:'Número de intentos de acceso sobrepasados' },
        identifierNoExists: { errorCode:53, message: 'No exixte identificador de pago asignado a este usuario' },
        refIdentifierNoExist: { errorCode: 54, message: 'No se ha podido guardar el identificador de pago por referencia' },
        couponNeedsPayment:  { errorCode: 55, message: 'Coupon needs payment to redeem'},
	    playlistIsAssignedToEplays: { errorCode: 56, message: 'Playlist is assigned to one or more eplays' },
        CampaignNotCompleted: { errorCode: 57, message: 'No se ha podido terminar la contratación' },
        macAddressNotFound: { errorCode: 58, message: 'This Mac Address not belong to any promotion' },
        userAlreadyRegisteredEmail: { errorCode: 60, message: 'User already registered with email'},
        userAlreadyRegisteredFacebook: { errorCode: 61, message: 'User already registered with facebook'},
        catalogNotExist: { errorCode: 61, message: 'Catalog doesnt exists' },
        badConnectionTrasparentCDN: { errorCode: 62, message: 'Contenido no subido a Transparent CDN', critical:true },
        badConnectionWTTCDN: { errorCode: 63, message: 'Contenido no subido a WTT CDN', critical:true },
        paramsInvalid: { errorCode: 64, message: 'Parametros en la llamada inválidos' },
        superplaylistForEplay: { errorCode: 65, message: 'No existe la superplaylist asignada al eplay' },
        emissiongroupDoesntExist: { errorCode: 65, message: 'No existe la banda de emisión' }
};


function FunctionalError(errName) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    var self = this;
    self.name = "FunctionalError";
    var error = functionalErrorNames[errName] || functionalErrorNames['genericError'];
    self.errorName = errName;
    self.errorCode = error.errorCode;
    self.message = error.message;

    return this;
}

util.inherits(FunctionalError, Error);


module.exports.isFunctionalError = function(err){
    return (err !== undefined) && (err.name == "FunctionalError");
}


module.exports.createError = function(errCode){
    return new FunctionalError(errCode);
}
