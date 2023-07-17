import { findUsers, findUserById, deleteUserById, findAndDeleteOldUsers } from "../service/userService.js";
import path from 'path';

export const getUsers = async (req, res, next) => {

    req.logger.http(`Petición llegó al controlador (getUsers).`);

    try {
        const users = await findUsers()
        res.status(200).json({
            status: "success",
            payload: users
        })

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {

    req.logger.http(`Petición llegó al controlador (deleteUser).`);
    const userId = req.params.uid

    try {
        const user = await deleteUserById(userId);
        res.status(200).json({
            status: "success",
            message: `El usuario Id: ${userId} ha sido eliminado`
        })

    } catch (error) {
        req.logger.error(error.message)
        next(error)
    }
}

export const deleteOldUsers = async (req, res, next) => {

    req.logger.http(`Petición llegó al controlador (deleteOldUsers).`);

    try {

        const deletedUserCount = await findAndDeleteOldUsers()
        res.status(200).json({
            status: "success",
            message: `Se han eliminado ${deletedUserCount} usuario/s`
        })


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

export const updateUserRole = async (req, res, next) => {
    req.logger.http(`Petición llegó al controlador (updateUserRole).`);
    const user = req.user;

    try {
        if (user.role === "usuario") {
            const premiumDocumentsCount = user.documents.reduce((count, doc) => {
                return count + (doc.name.startsWith('profile') ? 0 : 1);
            }, 0);

            if (premiumDocumentsCount < 3) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El usuario no cumple con los requisitos para el rol premium'
                });
            }

            user.role = 'premium';
            await user.save();
            return res.status(200).json({
                status: "error",
                message: 'Rol de usuario actualizado a premium'
            });
        }

        user.role = 'usuario';
        await user.save();
        return res.status(200).json({
            status: "error",
            message: 'Rol premium actualizado a usuario'
        });

    } catch (error) {
        req.logger.error(error.message);
        next(error);
    }
}