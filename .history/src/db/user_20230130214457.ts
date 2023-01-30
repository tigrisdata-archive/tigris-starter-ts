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
  
}
export const userSchema: TigrisSchema<User> = {
  userId: {
    type: TigrisDataTypes.INT64,
    primary_key: {
      order: 1,
      autoGenerate: true,
    },
  },
  name: {
    type: TigrisDataTypes.STRING,
  },
  balance: {
    type: TigrisDataTypes.NUMBER,
  },
};
