const express = require('express');
const shipping = require('./shipping');
const inventory = require('./inventory');
const cors = require('cors');
const { json } = require('express');

const app = express();
app.use(express.json());
app.use(cors());

/**
 * Retorna a lista de produtos da loja via InventoryService
 */
app.get('/products', (req, res, next) => {
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(data.products);
        }
    });
});

/**
 * Consulta o frete de envio no ShippingService
 */
app.get('/shipping/:cep', (req, res, next) => {
    shipping.GetShippingRate(
        {
            cep: req.params.cep,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});
app.get('/product/:id', (req, res, next) => {
    
    inventory.SearchProductByID({ id: req.params.id }, (err, product) => {
        
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            
            res.json(product);
        }
    });
});

app.post('/product/', (req, res, next) => {
    const product = req.body;
    res.json(product);
    
    inventory.AddProduct(product , (err, returnedProduct) => {
        
        if (err) {
            console.error(err);
            res.status(201).send({ error: 'something failed :(' });
        } else {
            
            res.json(returnedProduct);
        }
    });
});
app.post('/product/:id', (req, res, next) => {
    const product = req.body;
    product.id = parseInt(req.params.id);

    
    
    inventory.UpdateInventory(product , (err, returnedProduct) => {
        
        if (err) {
            console.error(err);
            res.status(201).send({ error: 'something failed :(' });
        } else {
            
            res.json(returnedProduct);
        }
    });
});



/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service running on http://localhost:3000');
});
