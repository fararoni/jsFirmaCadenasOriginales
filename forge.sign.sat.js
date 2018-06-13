//--------------------- REFERENCIAS ------------------------------------------------------------------------------------
// Usar forge.min 0.7.0
// https://github.com/digitalbazaar/forge/issues/274

//----------------------------------------------------------------------------------------------------------------------
//---------------------------- Servicios de Firma Electrónica FORGE ----------------------------------------------------
    /****
    *   Variables Globales
    */
    var certificatePem  ;
    var forgeCertificate;
    var privateKeyPem   ;

    /*****
    *   Conversiones -
    */
    // source: http://stackoverflow.com/a/11058858
    function arrayBufferToPem(arrayBuffer){
        var certificado = window.btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
        //-- Dividir en líneas
        var string_length = certificado.length;
        var result_string = "";
        for (var i = 0, count = 0; i < string_length; i++, count++) {
            if (count > 63) {
                    result_string = result_string + "\r\n";
                    count = 0;
             }
             result_string = result_string + certificado[i];
        }
        return result_string;
    }

    function arrayBufferToCertPem (arrayBuffer){
        return   '-----BEGIN CERTIFICATE-----\r\n'
                + arrayBufferToPem(arrayBuffer)
                +'-----END CERTIFICATE-----\r\n';
    }

    function arrayBufferToPrivatePem (arrayBuffer){
        return    '-----BEGIN ENCRYPTED PRIVATE KEY-----\r\n'
                + arrayBufferToPem(arrayBuffer) + "\r\n"
                + '-----END ENCRYPTED PRIVATE KEY-----\r\n';
    }

    /*****
    *   Verificar Firma -
    */
    function verifyPrivateKey(privateKeyPem, password) {
        return new Promise(function (resolve, reject) {
                var decrypt = forge.pki.decryptRsaPrivateKey(privateKeyPem, password);
                if ( decrypt === null ) {
                    reject(Error('La contraseña de la llave privada es incorrecta'));
                } else {
                    resolve(true);
                }
            },
                function (error) {
                reject(Error("Error en la lectura del PKCS#8: " + error.message));
            });
    } // End of verifyPrivateKey

    function massiveSign(privateKey, message) {
            return new Promise(function (resolve, reject) {
                    var md = forge.md.sha256.create();
                        md.update(message, 'utf8');
                    var signature = privateKey.sign(md);
                    resolve(signature);
                }, function (error) {
                    reject(Error("Error en la lectura del PKCS#8: " + error.message));
            });
        } // End of verifyPrivateKey

    function sign(privateKeyPem, password, message) {
        return new Promise(function (resolve, reject) {
                var privateKey = forge.pki.decryptRsaPrivateKey(privateKeyPem, password);
                var md = forge.md.sha256.create();
                    md.update(message, 'utf8');
                var signature = privateKey.sign(md);
               resolve(signature);
            }, function (error) {
                reject(Error("Error en la lectura del PKCS#8: " + error.message));
        });
    } // End of verifyPrivateKey

//---------------------------- Fin Servicios de Firma Electrónica FORGE ------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
//---------------------------- Servicios de Firma Electrónica - Algoritmo Masiva ---------------------------------------
// http://blogs.sitepoint.com/2010/12/08/javascript-large-data-processing/
function ProcessArray(data, handler, callback) {
    start = Date.now();
    console.log (" Inicio :"+ start);

    var maxtime = 100;		// chunk processing time
    var delay = 20;		// delay between processes
    var queue = data.concat();	// clone original array
    setTimeout(function() {
        var endtime = +new Date() + maxtime;
        do {
          handler(queue.shift());
        } while (queue.length > 0 && endtime > +new Date());
        if (queue.length > 0) {
          setTimeout(arguments.callee, delay);
        }
        else {
          if (callback) callback();
        }
      }, delay);
}    // end of ProcessArray function
//---------------------------- - - ------------------------------------ ------------------------------------------------

//---------------------------- Efecto de carga de archivo --------------------------------------------------------------
var wrapper = $('<div/>').css({
    height:0,
    width:0,
    'overflow':'hidden'
});
