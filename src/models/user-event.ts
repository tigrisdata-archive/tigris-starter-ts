import {
  TigrisTopicType,
  TigrisDataTypes,
  TigrisSchema,
} from "@tigrisdata/core/dist/types";

export interface UserEvent extends TigrisTopicType {
  userId: string;
  eventType: string;
  eventDescription?: string;
}

export const userEventSchema: TigrisSchema<UserEvent> = {
  userId: {
    type: TigrisDataTypes.INT64,
  },
  eventType: {
    type: TigrisDataTypes.STRING,
  },
  eventDescription: {
    type: TigrisDataTypes.STRING,
  },
};
