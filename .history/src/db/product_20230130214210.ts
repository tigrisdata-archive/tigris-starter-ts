import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection(]'products')
export class Product{
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  productId: number

  @Field(TigrisDataTypes.STRING)
  name: string;
  price: {
    type: TigrisDataTypes.NUMBER,
  },
  quantity: {
    type: TigrisDataTypes.INT32,
  },
};
