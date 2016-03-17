# nodepop
API con nodejs y mongodb para una aplicación de venta de artículos.

Pasos a seguir:

Dentro de la carpeta de nuestro repositorio: 

Añadir archivo .gitignore
npm init
npm install express-generator -g

cd <proyecto>
npm install
npm install mongodb --save
npm install mongoose --save
npm install nodemon --save

Para empezar: 

1- Ejecutamos 
startMongo (debemos tener una carpeta nodepop/data/db en nuestro proyecto)
2- cd nodepop
3- Instalamos dependencias con npm install
4(opcional)- npm run InstallDB //Para inicializar base de datos
5- Para generar documentación: npm run apidoc
6- nodemon //Para ejecutar nuestra aplicación

Instrucciones de Uso:

Ver anuncios (deberemos autenticarnos): 
	localhost:3000/anuncios/
Ver etiquetas de anuncios:
	localhost:3000/anuncios/tags
Ver usuarios
	localhost:3000/usuarios/

Ejemplo filtrado anuncios:
	http://localhost:3000/anuncios?tag=mobile&venta=false&nombre=ip&precio=50&start=0&limit=2&sort=precio

Insertar usuario
	POST a localhost:3000/usuarios/
Insertar anuncio
	POST a localhost:3000/anuncios/


