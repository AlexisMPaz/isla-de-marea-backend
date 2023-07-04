# Backend - Proyecto Final para CoderHouse

Comisión: 39685
Alumno: Alexis Paz

Antes de iniciar la aplicacion se debe instalar las dependencias con:

- npm i

**Las variables de entorno necesarias se encuentran en la entrega por la plataforma de Coder**
- Se ha agregado los datos del Admin a las variables de entorno

Para iniciar el servidor (script):

* (puerto 8080, entorno desarrollo): npm run dev

* (puerto 4000, entorno produccion): npm run prod

**POSTMAN**

Para testear la aplicacion con postman se debe agregar en los request, el header:
key: Origin         value: http://localhost:3000 (IMPORTANTE)

**Cuarta Practica Integradora**

- Modificado el schema de usuarios para poseer los campos: last_connection y documentos.

* last_connection: Es un Date.now() que se actualiza cuando el usuario es creado, hace login y cuando se desconecta. Los cambios se encuentran en el controlador de login y logout.
No hizo falta en el de registrarse porque viene por el default del modelo de mongoose.

* documents: Cambie un poco la logica de como se pedia ya que hemos quitado toda la parte de usuarios premium del desafio. Los documentos se suben en la carpeta uploads en la carpeta raiz del proyecto. Esto esta hecho con Multer, su configuracion se encuentra en src/config/multer/multer.js

    - Cuando un usuario sube ya sea una imagen de perfil o uno o mas documentos, se crea en la carpeta uploads un subcarpeta con el id del usuario como nombre, de esta manera queda mas ordenados los archivos y son se mas facil acceso.

    - Los archivos pueden ser enviados desde un formulario con el nombre profile o document: 
    
        -Si el archivo es profile soloa cepta jpeg, jpg y png y es guardado en la carpeta del usuario como profile.${extension}. Si ya existia un archivo que empiece con el nombre profile es borrado para dar espacio al nuevo archivo. No se reemplaza con multer porque como pueden ser de 3 extensiones distintas multer permitiria que haya 3 archivos con el mismo nombre.

        -Si hay archivos document, los guarda en la misma carpeta usando un Date.now() como nombre y su extension correspondiente. Como son documentos random no tienen extensiones permitidas, puede ser cualquiera.

    - En el controlador de usuarios (updateUserDocuments) Se encarga de manejar algunos errores de multer y si todo esta bien guarda en el array de documents del usuario el nombre y la referencia de cada document guardado por multer. Tambien se encarga de que no haya mas de 1 archivo profile.



    



