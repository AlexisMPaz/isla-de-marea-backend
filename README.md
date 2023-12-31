# Backend - Proyecto Final para CoderHouse

**Ecommerce - Servidor en Node.js con Express y Mongoose**

Comisión: 39685
Alumno: Alexis Paz

**Requisitos**

Node: v18.16.0

Antes de iniciar la aplicacion se debe instalar las dependencias con:

- npm i

**Las variables de entorno necesarias se encuentran en la entrega por la plataforma de Coder**
- Se ha agregado los datos del Admin a las variables de entorno

Para iniciar el servidor (comandos):

* (puerto 8080, entorno desarrollo): npm run dev

* (puerto 4000, entorno produccion): npm run prod

* (puerto 8080, version sin nodemon): npm run start

**POSTMAN**

En la carpeta raiz dejo el archivo: Test-Backend-Alexis-Paz.postman_collection Con la collection de request para POSTMAN modificado.

- Agregada la ruta de get producto por id
- Agregada la ruta de eliminar usuarios inactivos

Los cambios y la explicacion de las rutas se encuentran en la documentacion del archivo.

**API**

Sessions (api/session): Se encarga de controlar las sesiones activas de los usuarios mediante tokens de jwt.

 - POST (/register): Crea un nuevo usuario y lo conecta.
 - POST (/login): conecta al usuario si la informacion es correcta.
 - GET (/logout): Desconecta al usuario.
 - GET (/current): Devuelva la informacion del usuario conectado.
 - POST (/password/forgot): Envia un mail de recuperacion de contraseña con un Token.
 - POST (/password/reset): Actualiza al usuario con una nueva contraseña si el Token del email es valido.

 Users (api/users): Son algunos endpoints que involucran a los usuarios pero no entran en la categoria de sesion:

 - GET (/): Devuelve los datos relevantes de todos los usuarios.
 - DELETE (/clean): Elimna todos los usuarios de la base de datos con sus respectivos carritos que no se hayan conectado en los ultimos 3 dias.
 - DELETE (/:uid): Borra un usuario de la base de datos con su respectivo carrito.
 - PUT (/premium): Cambia el role de un usuario entre usuario y premium. Requiere documentacion.
 - POST (/upload): Usa Multer para subir documentos o una imagen de perfil del usuario y son guardadas en la carpeta uploads

Products (api/products): Se encargan de la gestion de los productos dentro de la base de datos. Sus endpoints incluyen:

 - GET (/): Devuelve todos los productos con un formato paginado.
 - GET (/pid): devuelve solo un producto por el Id.
 - POST (/): Crea un nuevo producto en la base de datos.
 - PUT (/pid): Modifica un producto en la base de datos.
 - DEL (/pid): Elimina un producto de la base de datos.

Carts (api/carts): Se encargan de la gestion del carritode compras, cuando un usuario se registra se cre un carrito y se le asigna su id a dicho usuario. Sus endpoints incluyen:

 - Get (/): Devuelve el carrito del usuario conectado.
 - POST (/product/:pid): Agrega un producto al carrito. Si este ya existe dentro, le suma uno a su cantidad.
 - PUT (/): Pisa el contenido del carrito con un nuevo array de productos.
 - PUT (/product/:pid): Modifica la cantidad de un producto dentro del carrito.
 - DEL (/product/:pid): Borra un producto dentro del carrito por su Id
 - DEL (/): Vacia el array de productos del carrito
 - POST (/purchase): Finaliza la compra si el carrito tenia todos sus productos validos y crea el thicket, por ultimo descuenta el stock y vacia el carrito.

**RENDER**

Render es un servicio de Hosting que permite crear paginas estaticas y servicios webs de forma gratuita.
La api esta hosteada en Render. La URL es: api-isla-de-marea.onrender.com
El front esta hosteado en Render. La URL es: app-isla-de-marea.onrender.com
Se puede mandar las request desde POSTMAN sin porblemas pero a causa de subdomio "onrender.com" no se permite el transito de cookies entre servicios web por lo tanto desde el front toda request que pide la token de jwt devolvera el mensaje de no hay usuario logeado.

**LOCAL**

Es recomendable usar el script npm run start. Localmente funciona la conexion con el front hecho en Next 13. El link al repositorio del front es: https://github.com/AlexisMPaz/isla-de-marea-frontend
Recordar guardar las varaibles de entorno del back en 2 archivos .env (.env.development y .env.production) en la ruta raiz para el back y un archivo .env (.env.local) en la carpeta raiz del front.
Las variables tanto del Back como la del Front estaran detalladas en la entrega.



    



