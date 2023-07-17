import { Router } from "express";
import { getUsers, updateUserDocuments, updateUserRole, deleteUser, deleteOldUsers } from "../controllers/user.controllers.js";
import { passportError } from "../config/middlewares/passportError.js";
import { roleValidation } from "../config/middlewares/roleValidation.js";
import uploadMulter from "../config/multer/multer.js";

export const routerUsers = Router();

//("/api/users")
routerUsers.get('/', passportError("jwt"), roleValidation(["admin"]), getUsers);
routerUsers.delete('/clean', passportError("jwt"), roleValidation(["admin"]), deleteOldUsers)
routerUsers.delete('/:uid', passportError("jwt"), roleValidation(["admin"]), deleteUser)


//Premium
routerUsers.put('/premium', passportError("jwt"), roleValidation(["usuario", "premium"]), updateUserRole)

//Multer
routerUsers.post('/upload', passportError('jwt'), roleValidation(["admin", "usuario"]),
    uploadMulter.fields([{ name: 'profile'}, { name: 'document'}]), updateUserDocuments)
