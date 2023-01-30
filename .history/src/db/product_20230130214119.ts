import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection(]'products')
export class Product{
  @PrimaryKey(TigrisDataTypes.INT, { order: 1, autoGenerate: true })
  productId: {
    type: TigrisDataTypes.INT64,
    primary_key: {
      order: 1,
      autoGenerate: true,
    },
  },
  name: {
    type: TigrisDataTypes.STRING,
  },
  price: {
    type: TigrisDataTypes.NUMBER,
  },
  quantity: {
    type: TigrisDataTypes.INT32,
  },
};
