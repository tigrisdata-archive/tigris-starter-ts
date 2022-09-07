import {
    TigrisTopicType,
    TigrisDataTypes,
    TigrisSchema
} from "@tigrisdata/core/dist/types";

export interface ProductUpdate extends TigrisTopicType {
    updateId: number;
    productId: number;
    price?: number;
    quantity?: number;
}

export const productUpdateSchema: TigrisSchema<ProductUpdate> = {
    updateId: {
        type: TigrisDataTypes.INT32,
        primary_key: {
            order: 1,
            autoGenerate: true
        }
    },
    productId: {
        type: TigrisDataTypes.INT32
    },
    price: {
        type: TigrisDataTypes.INT32
    },
    quantity: {
        type: TigrisDataTypes.NUMBER
    }
};
