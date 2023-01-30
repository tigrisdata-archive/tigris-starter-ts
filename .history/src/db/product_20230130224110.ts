import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("products02")
export class Product {
  @PrimaryKey(TigrisDataTypes.STRING, { order: 1, autoGenerate: true })
  productId: string;

  @Field(TigrisDataTypes.STRING)
  name: string;

  @Field(TigrisDataTypes.NUMBER)
  price: number;

  @Field(TigrisDataTypes.INT32)
  quantity: number;
}
