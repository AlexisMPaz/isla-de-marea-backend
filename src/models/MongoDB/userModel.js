import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: "usuario"
    },
    password: {
        type: String,
        required: true
    },
    idCart: {
        type: Schema.Types.ObjectId,
        ref: "Carts",
        required: true
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const userModel = model("Users", userSchema);

export default userModel