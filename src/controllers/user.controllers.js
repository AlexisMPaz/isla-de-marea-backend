import { findUsers, findUserById} from "../service/userService.js";
import path from 'path';

export const getUsers = async (req, res, next) => {

    req.logger.http(`Petición llegó al controlador (getUsers).`);

    try {
        const users = await findUsers()
        res.status(200).json({ users })

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const updateUserDocuments = async (req, res, next) => {
    req.logger.http('Petición llegó al controlador (uploadDocument');
    try {
        if (!req.files) {
            return res.status(400).send({
                status: "error",
                message: "No se ha proporcionado ningún documento",
            });
        }

        if (req.fileValidationError) {
            return res.status(400).send({
                status: "error",
                message: "El formato para la imagen de perfil debe ser: jpeg, jpg o png.",
            });
        }

        const user = await findUserById(req.user._id);

        //Si se subio una imagen de perfil
        if (req.files['profile']) {
            const profileIndex = user.documents.findIndex(document => document.name === "profile");
            if (profileIndex !== -1) {
                user.documents.splice(profileIndex, 1);
            }

            const profileFile = req.files['profile'][0];
            const profileFilePath = path.join(profileFile.destination, profileFile.filename);

            const newProfileFile = {
                name: 'profile',
                reference: profileFilePath
            };

            user.documents.push(newProfileFile);
        }

        //Si se subio uno o mas documentos
        if (req.files['document']) {
            req.files['document'].forEach(document => {
                const documentFilePath = path.join(document.destination, document.filename);

                const newDocumentFile = {
                    name: document.originalname,
                    reference: documentFilePath
                };

                user.documents.push(newDocumentFile);
            });
        }

        await user.save()

        return res.status(200).json({
            status: "success",
            message: "Se han guardado todos los documentos",
        })

    } catch (error) {
        req.logger.error(error.message);
        next(error);
    }
};