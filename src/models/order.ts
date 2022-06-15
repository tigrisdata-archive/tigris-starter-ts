import {
    TigrisCollectionType,
    TigrisDataTypes,
    TigrisSchema
} from "@tigrisdata/core/dist/types";

export interface Order extends TigrisCollectionType {
    orderId?: number;
    userId: number;
    productItems: ProductItem[]
    orderTotal: number;
}

export interface ProductItem {
    productId: number;
    quantity: number;
}

const productItemSchema: TigrisSchema<ProductItem> = {
    productId: {
        type: TigrisDataTypes.INT32
    },
    quantity: {
        type: TigrisDataTypes.INT32
    }
};
export const orderSchema: TigrisSchema<Order> = {
    orderId: {
        type: TigrisDataTypes.INT32,
        primary_key: {
            order: 1,
            autoGenerate: true
        }
    },
    userId: {
        type: TigrisDataTypes.INT32
    },
    orderTotal: {
        type: TigrisDataTypes.NUMBER
    },
    productItems: {
        type: TigrisDataTypes.ARRAY,
        items: {
            type: productItemSchema
        }
    }
};
