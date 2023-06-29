import ticketModel from "../models/MongoDB/ticketModel.js"
import CustomError from "../utils/customErrors/CustomError.js";
import { EErrors } from "../utils/customErrors/enums.js";

export const findTicketByCode = async (code) => {
    try {
        const ticket = await ticketModel.findOne({ code: code });
        return ticket;
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo encontrar el ticket.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}

export const createNewTicket = async (ticket) => {
    try {
        const newTicket = await ticketModel.create(ticket);
        return newTicket;
    } catch (error) {
        CustomError.createError({
            name: "Error en la base de datos.",
            message: "No se pudo crear el ticket.",
            cause: error.message,
            code: EErrors.DATABASE_ERROR
        })
    }
}