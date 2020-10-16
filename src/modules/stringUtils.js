/******************************************

    Módulo: 
    Descripción: 

********************************************/
//Definimos nombre del módulo
var __moduleName = '/templateUtils/stringUtils';

function capitalizeFirstLetter(string){
	if (string && string.length > 0)
		return string.charAt(0).toUpperCase() + string.slice(1);
	else
		return string;
}

module.exports.capitalizeFirstLetter = capitalizeFirstLetter;

module.exports.capitalizeFirstLetterOnArray = function(array){
	return array.map( function(elem){ 
		return capitalizeFirstLetter(elem); 
	} );
}

module.exports.newlinesToHtml = function(string){
	return (string || '')
            .split('\n').slice(1)
            .map(function(v){ return '' + v + ''; }).join('<br/>');
}