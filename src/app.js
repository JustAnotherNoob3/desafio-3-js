import { ProductManager } from './ProductManager.js';
import express from 'express'

const port = 8080;
const productManager = new ProductManager("./idk.json");
const app = express();

app.use(express.urlencoded({extended: true}));

app.get("/", async (req, res) => {
    res.send("Working");
});
app.get("/products", async (req, res) => {
    let limit = req.query.limit;
    let productArray = productManager.getProducts();
    if(!limit || isNaN(limit)){
        return res.send(productArray);
    }
    let limitArray = productArray.slice(0,Number(limit));
    res.send(limitArray);
});
app.get("/products/:pid", async (req, res) => {
    let id = req.params.pid;
    try{
        let product = await productManager.getProductById(id);
        res.send(product);
    } catch (error) {
        res.send(error.toString());
    }
    
    
});

app.listen(port, () => console.log("running"))