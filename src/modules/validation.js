// funciones generales

module.exports.valorNumerico = (cadena) => {

    let b = ['1', '2', '3', '4', '4'];

    const tipoDato = typeof(cadena);

    console.log(typeof(b), tipoDato);




    return isNaN(Number(cadena)) ? false : true;
}