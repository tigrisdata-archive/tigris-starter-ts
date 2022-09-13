import {
    TigrisTopicType,
    TigrisDataTypes,
    TigrisSchema
} from "@tigrisdata/core/dist/types";

export interface UserEvent extends TigrisTopicType {
    userId: number;
    eventType: string;
    eventDescription?: string;
}

export const userEventSchema: TigrisSchema<UserEvent> = {
    userId: {
        type: TigrisDataTypes.INT32
    },
    eventType: {
        type: TigrisDataTypes.STRING
    },
    eventDescription: {
        type: TigrisDataTypes.STRING
    }
};
