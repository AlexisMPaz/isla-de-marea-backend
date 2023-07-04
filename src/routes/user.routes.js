import { Router } from "express";
import { getUsers, updateUserDocuments } from "../controllers/user.controllers.js";
import { passportError } from "../config/middlewares/passportError.js";
import { roleValidation } from "../config/middlewares/roleValidation.js";
import uploadMulter from "../config/multer/multer.js";

export const routerUsers = Router();

//("/api/users")
routerUsers.get('/', passportError("jwt"), roleValidation(["admin"]), getUsers);


//Multer
routerUsers.post('/upload', passportError('jwt'), roleValidation(["admin", "usuario"]),
    uploadMulter.fields([{ name: 'profile'}, { name: 'document'}]), updateUserDocuments)
