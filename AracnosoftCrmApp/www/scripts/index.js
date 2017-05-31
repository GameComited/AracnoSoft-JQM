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

        //Escuchamos por la accion click sobre el boton de Iniciar Sesion
        document.getElementById("btnIniciar").addEventListener('click', iniciarSesion, false);

        //escuchamos por la accion click sobre el boton de cerrar sesion
        document.getElementById("btnSalir").addEventListener('click', cerrarSesion, false);
    }

    function onPause() {
        // TODO: esta aplicación se ha suspendido. Guarde el estado de la aplicación aquí.
    }

    function onResume() {
        // TODO: esta aplicación se ha reactivado. Restaure el estado de la aplicación aquí.
    }

   // ********************************** FUNCIONES PERSONALIZADAS ***************************************

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

} )();