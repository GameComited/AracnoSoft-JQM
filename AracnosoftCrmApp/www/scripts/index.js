// Si quiere una introducción sobre la plantilla En blanco, vea la siguiente documentación:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Para depurar código al cargar la página en cordova-simulate o en dispositivos o emuladores Android: inicie la aplicación, establezca puntos de interrupción 
// y ejecute "window.location.reload()" en la Consola de JavaScript.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    var db;

    function onDeviceReady() {
        // Controlar la pausa de Cordova y reanudar eventos
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);

        // conectamos con la base de datos
        db = window.openDatabase("BasedeDatos", "1.0", "CRM DB", 5 * 1024 * 1024);
        //creamos la tabla Contactos
        db.transaction(createDB, errorCB, successCB);

        //Escuchamos por la accion click sobre el boton de Iniciar Sesion
        document.getElementById("btnIniciar").addEventListener('click', iniciarSesion, false);

        //escuchamos por la accion click sobre el boton de cerrar sesion
        document.getElementById("btnSalir").addEventListener('click', cerrarSesion, false);

        //Cuando clickeen en el boton de guardar ejecutamos la funcion sumitform
        document.getElementById('botonguardar').addEventListener('click', submitForm, false);

    }

    function onPause() {
        // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    }

    function onResume() {
        // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    }

   // ********************************** FUNCIONES PERSONALIZADAS ***************************************

    function createDB(tx) {

        //creamos la tabla Contactos si no existe y seleccionamos todos los campos para luego en renderlist usarlos
        tx.executeSql('CREATE TABLE IF NOT EXISTS Contactos (idcontacto INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, empresa text, email text, telefono text, pais text, direccion text, ciudad text, provincia text, codigop text, perCon text, dni text, anotacion text)');
        tx.executeSql('SELECT * FROM Contactos', [], renderList, errorCB);
    }

    function successCB() {
        //nos alerta que se a realizado la consulta bien 
        //alert("La base de datos se ha consultado ya!");
    }

    function errorCB(err) {
        //nos alerta si no se consulto la tabla bien 
        alert("Error processing SQL: " + err.code);
    }

    //con esta funcion imprimimos en en el dispositivo los resultados que deseamos , en este caso emprea, persona de contacto y telefono
    function renderList(tx, results) {

        var htmlstring = '';

        var len = results.rows.length;

        if ( len != null ){

            for (var i = 0; i < len; i++) {

                htmlstring += '<li data-role="list-divider">' + results.rows.item(i).empresa + '</li><li><a href="#crearContacto?id=' + results.rows.item(i).idcontacto + '"><h2>' + results.rows.item(i).perCon + '</h2><p><strong>' + results.rows.item(i).telefono + '</strong></p></a></li>'

            }

            $("#listaresultado").html(htmlstring);
            $("#listaresultado").listview().listview('refresh');


        }

    }

    function insertDB(tx) {
        // Guardamos en variables los valores de los campos del formulario con sus respectivos nombres
        var _empresa = $("[name='empresa']").val();
        //alert(_empresa);
        var _email = $("[name='email']").val();
        //alert(_email);
        var _telefono = $("[name='telefono']").val();
        //alert(_telefono);
        var _pais = $("[name='pais']").val();
        //alert(_pais);
        var _direccion = $("[name='direccion']").val();
        //alert(_direccion);
        var _ciudad = $("[name='ciudad']").val();
        //alert(_ciudad);
        var _provincia = $("[name='provincia']").val();
        //alert(_provincia);
        var _codigop = $("[name='codigop']").val();
        //alert(_codigop);
        var _perCon = $("[name='perCon']").val();
        //alert(_perCon);
        var _dni = $("[name='dni']").val();
        //alert(_dni);
        var _anotacion = $("[name='anotacion']").val();
        //alert(_anotacion);
        //insertamos los valores en la tabla Contatos
        var sql = 'INSERT INTO Contactos (empresa, email, telefono, pais, direccion, ciudad, provincia, codigop, perCon, dni, anotacion) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        tx.executeSql(sql, [_empresa, _email, _telefono, _pais, _direccion, _ciudad, _provincia, _codigop, _perCon, _dni, _anotacion], sucessQueryDB, errorsubCB);
    }

    function errorsubCB(e) {
        //alertamos en caso de erros ejecutando la funcion sumitform
        alert('Error insertando los datos: ' + e.code);
    }

    function sucessQueryDB(tx) {

        //alert('exito insertando en contactos');
        $(':mobile-pagecontainer').pagecontainer('change', '#contactos', {
            transition: 'flip',
        });
        //tx.executeSql('SELECT * FROM Contactos', [], renderList, errorCB);
    }

    function iniciarSesion() {
        // funcion en la que recogemos los parametros del formulario, y los guardamos en una variable 
        var usuario = $("[name='usuario']").val();
        var passwd = $("[name='contrasena']").val();
        
        //console.log(user);
        //console.log(passw);

        // si usuario y pass son diferentes a null entonces logeamos y si el JSON no tiene error guardamos los parametros que nos pasa como son el codigo y el nombre.

        if (usuario != null && passwd != null) {
            $.get('http://www.miracomovendo.com/extranet/service_login.aspx?usuario=' + usuario + '&contrasena=' + passwd, function (data) {
                var obj = JSON.parse(data);
                if (obj.result != 'OK') {
                    alert('Introduce un email y una contraseña validos !!');
                } else {
                    var cod = obj.cod;
                    var nom = obj.nombre;
                    //guardamos el valor del codigo en el localStorage para usarlo posteriormente
                    localStorage.setItem("codigo", cod);
                    localStorage.setItem("nombre", nom);
                    $(':mobile-pagecontainer').pagecontainer('change', '#home', {
                        transition: 'fade'
                    });

                    //mostramos el nombre del usuario en la pagina home, dando la bienvenida
                    var salute = localStorage.getItem("nombre");
                    $("#salute").html("Bienvenido " + salute);
                }
            });
        }

    }

    function cerrarSesion() {

        var cod = "";
        var nom = "";
        var salute = "";
        var usuario = "";
        var passwd = "";

        localStorage.removeItem('nombre');
        localStorage.removeItem('codigo');

        $(':mobile-pagecontainer').pagecontainer('change', '#inicio', {
            transition: 'flip'
        });
    }

    function submitForm() {

        // realizamos la transaccion (vamos para la funcion insertDB)
        db.transaction(insertDB, errorsubCB);
        return false;

    }

} )();