const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../app');
const productModel = require('../../models/product.model');

describe('Api de productos, No se debe levantar el servidor', () => {

    beforeAll(async () => {
        //Conecto a la base de datos.
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');
    });

    describe('Pruebas de GET de /api/products', () => {

        let response;

        beforeAll(async () => {
            response = await request(app).get('/api/products').send();
        });

        test('La Petición debería funcionar', () => {
            expect(response.statusCode).toBe(200);
        });

        test('Debería responder un json', () => {
            expect(response.headers['content-type']).toContain('application/json');
        });

        test('Debería devolver un array', () => {
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('', () => {
        let response;
        const body = {
            name: "Test",
            description: "This is for test",
            price: 1.99,
            department: "Test",
            available: true,
            stock: 61
        }

        beforeAll(async () => {
            response = await request(app).post('/api/products').send(body);
        });

        afterAll(async () => {
            await productModel.deleteMany({ department: "Test" });
        });

        test('La url debería funcionar', async () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });
        test('Debe contener el Id', async () => {
            expect(response.body._id).toBeDefined();
        });

        test('La respuesta debería tener los mismos valores que el objeto que inserto', () => {
            expect(response.body.name).toBe(body.name);
        });
    });

    describe('Pruebas de PUT  /api/products', () => {
        let response;
        let newProduct;
        const body = {
            name: "Test",
            description: "This is for test",
            price: 1.99,
            department: "Test",
            available: true,
            stock: 61
        };

        beforeAll(async () => {
            //Creo un nuevo producto para lsa pruebas
            newProduct = await productModel.create(body);
            //Lanzo una peticion.
            response = await request(app)
                .put(`/api/products/${newProduct._id}`)
                .send({
                    name: 'Producto nuevo',
                    stock: 858
                });
        });

        test('La URL debe existir y devolver un json', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Deberíamos recibir el producto con los datos modificados', () => {
            expect(response.body.stock).toBe(858);
        });

        afterAll(async () => {
            //Despues de lanzar los tests borro el producto.
            await productModel.findByIdAndDelete(newProduct._id);
        });
    });

    describe('Pruebas DELETE /api/porducts/id', () => {
        let response;
        let newProduct;
        const body = {
            name: "Test",
            description: "This is for test",
            price: 1.99,
            department: "Test",
            available: true,
            stock: 61
        };
        beforeAll(async () => {
            newProduct = await productModel.create(body);
            response = await request(app)
                .delete(`/api/products/${newProduct._id}`)
                .send();
        });

        test('Debería existir la URL y devolvernos un JSON', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Debería borrar el producto de la base de datos', async () => {
            const productFind = await productModel.findById(newProduct._id);
            expect(productFind).toBeNull();
        });
    })
    afterAll(async () => {
        //Desconecto de la base de datos.
        await mongoose.disconnect();
    });
});