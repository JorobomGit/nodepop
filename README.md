# nodepop
##API con nodejs y mongodb para una aplicación de venta de artículos.

###Para empezar: 

 1 Ejecutamos startMongo.bat para iniciar el servidor de Mongo
```
startMongo
```
 2 cd nodepop
```
cd nodepop
```
 3 Instalamos dependencias con npm install
```
npm install
```
 4 npm run InstallDB (opcional). Para inicializar base de datos
```
npm run InstallDB
```
 5 Para generar documentación: npm run apidoc
```
npm run apidoc
```
 6 nodemon para ejecutar nuestra aplicación
```
nodemon
```


###Instrucciones de Uso:

* Ver anuncios (deberemos autenticarnos): 
	```
	localhost:3000/anuncios/
	```
* Ver etiquetas de anuncios:
	```
	localhost:3000/anuncios/tags
	```
* Ver usuarios:
	```
	localhost:3000/usuarios/
	```

* Ejemplo filtrado anuncios:
	```
	http://localhost:3000/anuncios?tag=mobile&venta=false&nombre=ip&precio=50&start=0&limit=2&sort=precio
	```

* Insertar usuario:
	```
	POST a localhost:3000/usuarios/
	```
* Insertar anuncio:
	```
	POST a localhost:3000/anuncios/
	```

* Ver documentación
	```
	localhost:3000/apidoc/
	```


## Changelog

### v.1.0.0 - 2016-03-18

* Implementación base de datos con Mongo.
* Node básico con express.
* Script InstallDB asíncrono con promesas.
* Iniciación en Apidoc.
* Introducción de usuarios y anuncios.
* Añadido filtrado, paginación y ordenación.
* Registro.
* Autenticación.
* Hashing
* Muestra de tags
* Vistas simples

