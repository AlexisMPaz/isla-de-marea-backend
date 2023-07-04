import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { __dirname } from '../../path.js';

// Extensiones permitidas
const allowedExtensions = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user._id.toString();
    // Carpeta del usuario
    const userFolderPath = path.join(__dirname, '..', 'uploads', userId);

    // Si la carpeta del usuario no existe la crea
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    req.userFolderPath = userFolderPath;

    cb(null, userFolderPath);
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'profile') {
      // Si es el archivo para la imagen de perfil
      const extension = path.extname(file.originalname);
      if (allowedExtensions.includes(extension)) {

        // Verificar si existe un archivo de perfil y lo borra si lo encuentra
        const oldProfileFile = fs.readdirSync(req.userFolderPath).find((fileName) => {
          return fileName.startsWith('profile');
        });

        if (oldProfileFile) {
          const oldFilePath = path.join(req.userFolderPath, oldProfileFile)
          fs.unlinkSync(oldFilePath)
        }

        cb(null, `profile${extension}`);
      } else {
        req.fileValidationError = true;  // Marcar el error en el request
        cb(null, false);
      }
    } else {
      // Para otros archivos de documentación
      const extension = path.extname(file.originalname);
      const fileName = `${Date.now()}${extension}`;
      cb(null, fileName);
    }
  }
});

const uploadMulter = multer({ storage });

export default uploadMulter;

