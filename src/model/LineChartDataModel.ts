export default interface LineChartDataModel {
    id: string;
    sensorName: string;
    categories: Array<string>;
    data: Array<number>;
}