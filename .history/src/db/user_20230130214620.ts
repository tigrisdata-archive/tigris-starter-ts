import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

export interface User extends TigrisCollectionType {
  userId?: number;
  name: string;
  balance: number;
}

@TigrisCollection('users')
export class User {
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  userId: number;


  @Field(TigrisDataTypes.STRING)
  name: string;

}
export const userSchema: TigrisSchema<User> = {
 
  name: {
    type: TigrisDataTypes.STRING,
  },
  balance: {
    type: TigrisDataTypes.NUMBER,
  },
};
