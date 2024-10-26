import { jewelleryType } from "./productType";

export class CartItem {
    constructor(public product:jewelleryType) {
        this.price = product.price;
    }
    quantity: number = 1;
    price: number = 0;
}