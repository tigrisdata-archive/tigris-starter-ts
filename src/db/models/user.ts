import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("users")
export class User {
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  userId?: string;

  @Field(TigrisDataTypes.STRING)
  name: string;

  @Field(TigrisDataTypes.NUMBER)
  balance: number;
}
