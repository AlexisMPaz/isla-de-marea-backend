import '../src/config/dotenv/dotenv.js';
import chai from "chai";
import supertest from "supertest";
import mongoose from 'mongoose';
import userModel from '../src/models/MongoDB/userModel.js';
import cartModel from '../src/models/MongoDB/cartModel.js';

const expect = chai.expect;

const requester = supertest('http://localhost:8080');

describe("Test: Simulación de compra", () => {

    let token = { name: "", value: "" }
    let userId = ""
    let cartId = ""

    const connectionMongoose = async () => {
        try {
            await mongoose.connect(process.env.URLMONGODB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB');
        } catch (error) {
            console.log('Failed to connect to MongoDB:', error);
        }
    };
    
    connectionMongoose();

    //REGISTER
    it("Ruta: api/session/register con el metodo POST", async function () {
        const newUser = {
            first_name: "Test",
            last_name: "Purchase",
            email: "test@purchase.com",
            age: 18,
            password: "test"
        }

        const response = await requester.post('/api/session/register').send(newUser);

        //Comprueba si el status es 200
        expect(response.statusCode).to.equal(200);
        console.log("Creando un nuevo usuario");
        console.log(`Status: ${response.body.status}`);
        console.log(`${response.body.message}`);
    })

    //LOGIN
    it("Ruta: api/session/login con el metodo POST", async function () {
        const newUser = {
            email: "test@purchase.com",
            password: "test"
        }

        const response = await requester.post('/api/session/login').send(newUser);
        const tokenResult = response.headers['set-cookie'][0];

        //Verifica que exista la token en la respuesta
        expect(tokenResult).to.be.ok;

        token = {
            name: tokenResult.split("=")[0],
            value: tokenResult.split("=")[1],
        }

        //Comprueba que el status es 200
        expect(response.statusCode).to.equal(200);
        console.log("Login con el nuevo usuario");
        console.log(`Status: ${response.body.status}`);
        console.log(`Message: ${response.body.message}`);


        //Verifica el nombre y el valor de la Token
        expect(token.name).to.be.ok.and.equal('jwt');
        expect(token.value).to.be.ok;
        console.log(`Token: ${token.name} = ${token.value}`);

        userId = response.body.payload._id;
        cartId = response.body.payload.idCart;
    })

    //INGRESAR PRODUCTOS AL CARRITO
    it("Ruta: api/carts/product/pid con el metodo POST", async function () {

        const pid = "6484ef9c0ef3f7cd1fec80ab"

        await requester
            .post(`/api/carts/product/${pid}`)
            .set('Cookie', [`${token.name}=${token.value}`])

        const response = await requester
            .post(`/api/carts/product/${pid}`)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(response.statusCode).to.equal(200);

        console.log("Agregar el mismo producto 2 veces")
        console.log(`Status: ${response.body.status}`)
        console.log(`Message: ${response.body.message}`)
        console.log("Cart:", JSON.stringify(response.body.payload, null, 2))
    })

    //Finaliza la compra creando y mostrando el Ticket, por ultimo se borra el usuario
    it("Ruta: api/carts/purshase con el metodo POST", async function () {

        const response = await requester
            .post(`/api/carts/purchase`)
            .set('Cookie', [`${token.name}=${token.value}`])

        //Comprueba que el status es 200
        expect(response.statusCode).to.equal(200);

        console.log("Termina la compra y devuelve el ticket")
        console.log(`Status: ${response.body.status}`)
        console.log(`Message: ${response.body.message}`)
        console.log("Ticket:", JSON.stringify(response.body.payload, null, 2))

        await userModel.findByIdAndDelete(userId)
        await cartModel.findByIdAndDelete(cartId);
    })
})