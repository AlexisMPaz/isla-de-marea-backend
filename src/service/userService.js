import cartModel from "../models/MongoDB/cartModel.js";
import userModel from "../models/MongoDB/userModel.js";
import CustomError from "../utils/customErrors/CustomError.js";
import { EErrors } from "../utils/customErrors/enums.js";

export const findUsers = async () => {
    try {
        return await userModel.find().select('first_name last_name email role _id');
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo encontrar a los usuarios.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const findUserById = async (id) => {
    try {
        return await userModel.findById(id);
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo encontrar al usuario.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const findUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email: email });
        return user
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo encontrar al usuario.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const createUser = async (user) => {
    try {
        const newUser = await userModel.create(user);
        return newUser;
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo crear el usuario.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const deleteUserById = async (id) => {
    try {
      const deletedUser = await userModel.findById(id);
      const deleteResult = await userModel.findByIdAndDelete(id)
      await cartModel.findByIdAndDelete(deletedUser.idCart);

      return deleteResult;
      
    } catch (error) {
      CustomError.createError({
        name: "Error en la base de datos.",
        message: "No se pudo borrar el usuario.",
        cause: error.message,
        code: EErrors.DATABASE_ERROR
      });
    }
  };

export const findAndDeleteOldUsers = async () => {
    try {
      const timeLimit = Date.now() - 3 * 24 * 60 * 60 * 1000;
  
      const deletedUsers = await userModel.find({
        last_connection: { $lt: timeLimit },
        role: { $ne: "admin" },
      });
  
      if (deletedUsers.length > 0) {
        await cartModel.deleteMany({
          _id: { $in: deletedUsers.map(user => user.idCart) },
        });
  
        const deleteManyResult = await userModel.deleteMany({
          _id: { $in: deletedUsers.map(user => user._id) },
        });
  
        return deleteManyResult.deletedCount;
      } else {
        return 0;
      }
    } catch (error) {
      CustomError.createError({
        name: "Error en la base de datos.",
        message: "No se pudo borrar el usuario.",
        cause: error.message,
        code: EErrors.DATABASE_ERROR,
      });
    }
  };

export const updateUser = async (id, info) => {
    try {
        return await userModel.findByIdAndUpdate(id, info, { new: true });
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo actualizar al usuario.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}
