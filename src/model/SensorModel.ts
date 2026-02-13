import type {FormField} from "./FormSchema.ts";

export interface NameTypeModel {
    name: string;
    type: string;
}
export interface StructParserModel {
    endianness: string;
    fields: Array<NameTypeModel>;
}
export interface CharacteristicModel {
    uuid: string;
    name: string;
    mqttTopic: string;
    structParser: StructParserModel;
}

export interface ServiceModel {
    uuid: string;
    name: string;
    characteristics: Array<CharacteristicModel>;
}

export default interface SensorModel {
    _id?: string;
    name: string;
    shortName: string;
    services: Array<ServiceModel>;
    dynamicSchema?: Array<FormField>;
    dynamicJson?: any;
}