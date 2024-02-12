import fs from 'node:fs';

export class ProductManager {
    #path;
    constructor(path) {
        this.#path = path;
        if (!fs.existsSync(path)) fs.writeFileSync(path, "[]");
    }
    async addProduct(product) {
        let products = this.getProducts();
        if (!this.#checkIfValidProductKeys(product)) {
            throw Error(`Given product has invalid keys:  ${Object.keys(product)}`);
        }
        if (this.#argumentsHaveFalsyNotZero(Object.values(product)) || product.price <= 0) {
            throw Error(`There were values undefined or impossible. Not creating product ${Object.values(product)}`);
        }
        if (!this.#checkValidCode(products, product.code)) {
            throw Error("The given code is already on use.");
        }
        let newProduct = {
            id: this.#generateNewId(products),
            ...product
        };
        products[products.length] = newProduct;
        this.#saveProductsToFile(products);
    }
    async updateProduct(id, product) {
        let products = this.getProducts();
        if (this.#argumentsHaveFalsyNotZero(Object.values(product))) {
            throw Error(`There were values undefined or impossible. Not updating to product ${Object.values(product)}`);
        }
        if (product.price !== undefined && product.price <= 0) {
            throw Error(`There were values undefined or impossible. Not updating to product ${Object.values(product)}`);
        }
        let index = products.findIndex((element) => element.id === id);
        if (index === -1) {
            throw Error(`No product with id ${id} was found.`);
        }
        if (product.code !== undefined) {
            let check = products.findIndex((element) => (element.code === product.code && element.id !== id));
            if (check !== -1) {
                throw Error("The given code is already on use.");
            }
        }
        let newProduct = products[index];
        Object.keys(newProduct).forEach((element) => {
            if (element === "id") return;
            if (product[element] === undefined) return;
            newProduct[element] = product[element];
        })
        products[index] = newProduct;
        this.#saveProductsToFile(products);
    }
    async deleteProduct(productId) {
        let products = this.getProducts();
        let index = products.findIndex((element) => element.id === productId);
        if (index === -1) {
            throw Error(`No product with id ${productId} was found.`);
        }
        products.splice(index, 1);
        this.#saveProductsToFile(products);
    }
    getProducts() {
        let products = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
        return products;
    }
    async getProductById(productId) {
        let products = this.getProducts()
        const product = products.findIndex(
            (element) => element.id == productId
        );
        if (product === -1) {
            throw Error(`No product with id ${productId}`);
        }
        return products[product];

    }

    #saveProductsToFile(products) {
        let jsonString = JSON.stringify(products);
        fs.writeFileSync(this.#path, jsonString);
    }
    #checkIfValidProductKeys(obj) {
        return this.#equalArrays(Object.keys(obj), ["title", "description", "price", "thumbnail", "code", "stock"]);
    }
    #argumentsHaveFalsyNotZero(arr) {
        let isFalsy = false;
        arr.forEach((element) => {
            if (!element && element !== 0) isFalsy = true;
        });
        return isFalsy;
    }
    #equalArrays(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    #checkValidCode(arr, code) {
        const check = arr.findIndex((element) => element.code === code);
        return check === -1;
    }
    #generateNewId(arr) {
        if (arr.length === 0) return 1;
        return arr[arr.length - 1].id + 1;
    }
}


