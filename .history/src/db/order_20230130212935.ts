import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

export interface Order  {
  orderId?: string;
  userId: string;
  productItems: ProductItem[];
  orderTotal: number;
}

export interface ProductItem {
  productId: string;
  quantity: number;
}

const productItemSchema: TigrisSchema<ProductItem> = {
  productId: {
    type: TigrisDataTypes.INT64,
  },
  quantity: {
    type: TigrisDataTypes.INT32,
  },
};
export const orderSchema: TigrisSchema<Order> = {
  orderId: {
    type: TigrisDataTypes.INT64,
    primary_key: {
      order: 1,
      autoGenerate: true,
    },
  },
  userId: {
    type: TigrisDataTypes.INT64,
  },
  orderTotal: {
    type: TigrisDataTypes.NUMBER,
  },
  productItems: {
    type: TigrisDataTypes.ARRAY,
    items: {
      type: productItemSchema,
    },
  },
};
