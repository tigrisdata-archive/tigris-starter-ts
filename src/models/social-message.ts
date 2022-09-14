import {
    TigrisTopicType,
    TigrisDataTypes,
    TigrisSchema
} from "@tigrisdata/core/dist/types";

export interface SocialMessage extends TigrisTopicType {
    nickName: string;
    message: string;
}

export const socialMessageSchema: TigrisSchema<SocialMessage> = {
    nickName: {
        type: TigrisDataTypes.STRING
    },
    message: {
        type: TigrisDataTypes.STRING
    }
};
