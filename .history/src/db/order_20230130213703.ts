import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

// export class Order  {
//   orderId?: string;
//   userId: string;
//   productItems: ProductItem[];
//   orderTotal: number;
// }

// export interface ProductItem {
//   productId: string;
//   quantity: number;
// }

export class Product {
  @PrimaryKey(TigrisDataTypes.STRING, { order: 1 })
  productId: string;

  @Field(TigrisDataTypes.INT32)
  quantity: number;
}

// const productItemSchema: TigrisSchema<ProductItem> = {
//   productId: {
//     type: TigrisDataTypes.INT64,
//   },
//   quantity: {
//     type: TigrisDataTypes.INT32,
//   },
// };
export class Oder {
  @PrimaryKey(TigrisDataTypes.STRING, { order: 1 })
  orderId: string;

  @Field(TigrisDataTypes.INT64)
  userId: number;

  @Field(TigrisDataTypes.NUMBER)
  orderTotal: number;

  @Field(TigrisDataTypes.ARRAY)
  productItems: Array<Product>;
}
// export const orderSchema: TigrisSchema<Order> = {
//   orderId: {
//     type: TigrisDataTypes.INT64,
//     primary_key: {
//       order: 1,
//       autoGenerate: true,
//     },
//   },
//   userId: {
//     type: TigrisDataTypes.INT64,
//   },
//   orderTotal: {
//     type: TigrisDataTypes.NUMBER,
//   },
//   productItems: {
//     type: TigrisDataTypes.ARRAY,
//     items: {
//       type: productItemSchema,
//     },
//   },
// };
