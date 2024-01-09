import fs from 'fs';
import path from 'path';
// const fs = require('fs');
// const path = require('path');
const dbFile = 'db.json';

const finished = (error) => {
    if (error) {
        console.error(error);
        return;
    }
};

export class ProductManager {
    constructor(my_path = process.cwd(), file = dbFile) {
        this.my_path = my_path;
        this.file = file;
        this.originalProducts = {};
        this.currentId = 0;

        if (!fs.existsSync(path.join(this.my_path, this.file))) {
            try {
                fs.writeFileSync(path.join(this.my_path, this.file), JSON.stringify(this.originalProducts, null, 2));
            } catch (e) {
                console.log(`Error: ${e}`);
            }
        }

        const readProducts = fs.readFileSync(path.join(this.my_path, this.file), 'utf-8');
        this.products = JSON.parse(readProducts);
        this.currentId = Object.keys(this.products)[Object.keys(this.products).length - 1];
    }

    addProduct(title, description, price, thumbnail, stock, code) {
        if (stock <= 0 || typeof stock !== 'number') {
            console.log('Debe ingresar una cantidad real');
            return '';
        }

        let ids = [];
        let codes = [];
        Object.entries(this.products).forEach((producto) => {
            ids.push(producto[0]);
            codes.push(producto[1]['code']);
        });

        let max = Math.max(...ids);

        if (max == '-Infinity') {
            max = 0;
        }

        if (codes.includes(code)) {
            console.log('El codigo no debe repetirse');
            return '';
        }

        let thisItem = {};

        thisItem.id = max + 1;
        thisItem.title = title;
        thisItem.description = description;
        thisItem.price = price;
        thisItem.thumbnail = thumbnail;
        thisItem.stock = stock;
        thisItem.code = code;

        this.products[thisItem.id] = thisItem;

        fs.writeFileSync(path.join(this.my_path, this.file), JSON.stringify(this.products, null, 2), 'utf-8', finished);
        console.log(`Producto agregado satisfactoriamente con el id ${thisItem.id}`);
    }

    getProducts() {
        if (this.currentId >= 1) {
            return this.products;
        } else {
            console.log('No products found');
            return '';
        }
    }

    getProductById(id = null) {
        if (this.products[id] === undefined) {
            console.log(`No existe un producto con el codigo ${id}`);
            return '';
        } else if (this.products[id]['title'] === undefined) {
            console.log(`Ese producto esta vacio`);
            return '';
        } else {
            return this.products[id];
        }
    }

    updateProduct(id, title, description, price, thumbnail, stock, code) {
        if (this.products[id] === undefined) {
            console.log(`No existe un producto con el codigo ${id}`);
            return '';
        } else {
            for (let i = 0; i < Object.keys(this.products).length; i = i + 1) {
                if (Object.values(this.products).find((value) => this.products[i + 1]['code'] === code) !== undefined) {
                    if (id - 1 !== i) {
                        console.log('El codigo no debe repetirse');
                        return '';
                    }
                }
            }
        }

        let thisItem = {};

        thisItem.id = id;
        thisItem.title = title;
        thisItem.description = description;
        thisItem.price = price;
        thisItem.thumbnail = thumbnail;
        thisItem.stock = stock;
        thisItem.code = code;

        this.products[id] = thisItem;

        fs.writeFileSync(path.join(this.my_path, this.file), JSON.stringify(this.products, null, 2), 'utf-8', finished);
        console.log(`Producto ${id} modificado satisfactoriamente`);
        return '';
    }

    deleteProduct(id) {
        if (this.products[id] === undefined) {
            console.log(`No existe un producto con el codigo ${id}`);
            return '';
        }

        delete this.products[id];

        fs.writeFileSync(path.join(this.path, this.file), JSON.stringify(this.products, null, 2), 'utf-8', finished);
        console.log(`Producto ${id} eliminado satisfactoriamente`);
        return '';
    }
}

/* ------------------------------------------------------------------------------------------ */
/* PRUEBAS DE INSERCION */
/* ------------------------------------------------------------------------------------------ */

// const prueba = new ProductManager();
// prueba.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 25, 'abc123');

// const producto1 = new ProductManager();
// producto1.addProduct('Manzana', 'Manzana Red Delicious del Valle', 99, 'manzana.jpg', 500, 'manzana-rd');

// const producto2 = new ProductManager();
// producto2.addProduct('Pera', 'Pera Williams de temporada', 80, 'pera.jpg', 350, 'pera-wi');

// const producto3 = new ProductManager();
// producto3.addProduct('Banana', 'Banana Ecuatoriana', 85.5, 'bananas.jpg', 200, 'banana-ec');

/* ------------------------------------------------------------------------------------------ */
/* PRUEBAS PARA OBTENER TODOS LOS PRODUCTOS, SOLO UNO, MODIFICARLO O ELIMINARLO */
/* ------------------------------------------------------------------------------------------ */

// const mis_productos = new ProductManager();
// console.log(mis_productos.getProducts());
// console.log(mis_productos.getProductById(1));
// console.log(mis_productos.updateProduct(1, 'producto prueba', 'Este es un producto prueba editado', 210, 'Con imagen', 22, 'abc123'));
// console.log(mis_productos.deleteProduct(3));
