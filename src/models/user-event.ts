import {
    TigrisTopicType,
    TigrisDataTypes,
    TigrisSchema
} from "@tigrisdata/core/dist/types";

export interface UserEvent extends TigrisTopicType {
    userName: string;
    message: string;
}

export const userEventSchema: TigrisSchema<UserEvent> = {
    userName: {
        type: TigrisDataTypes.STRING
    },
    message: {
        type: TigrisDataTypes.STRING
    }
};
