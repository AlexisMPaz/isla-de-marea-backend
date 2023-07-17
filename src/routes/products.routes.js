import { Router } from "express";
import { getProducts, getProduct, postProduct, updateProduct, deleteProduct } from "../controllers/product.controllers.js";
import { passportError } from "../config/middlewares/passportError.js";
import { roleValidation } from "../config/middlewares/roleValidation.js";

export const routerProduct = Router();

//("api/products")
routerProduct.get('/', getProducts);
routerProduct.get('/:pid', getProduct);
routerProduct.post('/', passportError("jwt"), roleValidation(["admin"]), postProduct);
routerProduct.put('/:pid', passportError("jwt"), roleValidation(["admin"]), updateProduct);
routerProduct.delete('/:pid', passportError("jwt"), roleValidation(["admin"]), deleteProduct);