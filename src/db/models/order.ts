import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";
import { Product } from "./product";

@TigrisCollection("orders")
export class Order {
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  orderId?: string;

  @Field(TigrisDataTypes.INT64)
  userId: string;

  @Field(TigrisDataTypes.NUMBER)
  orderTotal: number;

  @Field(TigrisDataTypes.ARRAY, { elements: Product })
  productItems: Array<Product>;
}
