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

  @Field(TigrisDataTypes.NUMBER)
  price: number;

  @Field(TigrisDataTypes.INT32)
  quantity: number;
};
