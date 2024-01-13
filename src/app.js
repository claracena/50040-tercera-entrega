import express from 'express';
import { ProductManager } from './productManager.js';

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(
        'Bienvenidos. Por favor utilice los siguientes links para navegar:</br></br>Todos los productos: <a href="http://localhost:8080/products">http://localhost:8080/products</a></br>L&iacute;mite de productos: <a href="http://localhost:8080/products?limit=2">http://localhost:8080/products?limit=2</a></br>Un solo productos: <a href="http://localhost:8080/products/2">http://localhost:8080/products/2</a>'
    );
});

app.get('/products', (req, res) => {
    const allProducts = new ProductManager();
    const prodList = allProducts.getProducts();
    const maxProducts = Object.keys(allProducts).length - 1;
    const newLimit = req.query.limit;
    if (newLimit !== undefined) {
        if (newLimit > maxProducts || newLimit <= 0 || isNaN(newLimit)) {
            res.send('El limite debe ser un numero mayor a cero e igual o menor a la cantidad de productos...');
        } else {
            res.send(Object.entries(prodList).slice(0, newLimit));
        }
    } else {
        res.send(allProducts.getProducts());
    }
});

app.get('/products/:pid', (req, res) => {
    const allProducts = new ProductManager();
    const newPid = req.params.pid;
    const selectedProduct = allProducts['products'][newPid];
    if (newPid !== undefined && selectedProduct !== undefined) {
        if (newPid <= 0 || isNaN(newPid)) {
            res.send('El ID debe ser un numero mayor a cero y existir en la lista de productos...');
        } else {
            res.send(selectedProduct);
        }
    } else {
        res.send('El ID debe ser un numero mayor a cero y existir en la lista de productos...');
    }
});

app.get('*', (req, res) => {
    res.send('404 Page Not Found');
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}. Press Ctrl + c to stop.`));
