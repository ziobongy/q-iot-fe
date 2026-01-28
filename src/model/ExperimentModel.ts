export interface ExperimentDeviceModel {
    sensorId: string;
    macAddress: string;
    enabledServices: Array<string>;
}
export default interface ExperimentModel {
    id?: string;
    experimentName: string;
    devices: Array<ExperimentDeviceModel>;
}