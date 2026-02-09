import {useParams} from "react-router";
import {createRef, type RefObject, useEffect, useRef, useState} from "react";
import type ExperimentModel from "../model/ExperimentModel.ts";
import axios from "../configurations/AxiosConfig.ts";
import type {AxiosResponse} from "axios";
import type LineChartDataModel from "../model/LineChartDataModel.ts";
import ReactECharts from 'echarts-for-react';

interface RefsType {
    [key: string]: RefObject<ReactECharts | null>;
}

export default function ExperimentDashboard() {
    const params = useParams();
    const refsRef = useRef<RefsType>({});
    const [refs, setRefs] = useState<RefsType>({});
    const intervalRefs = useRef<Array<number>>([]);
    const [experiment, setExperiment] = useState<ExperimentModel | undefined>(undefined);
    const dashboardsRef = useRef<{[key: string]: LineChartDataModel}>({});
    const [dashboards, setDashboards] = useState<{[key: string]: LineChartDataModel}>({});

    useEffect(() => {
        if (params != null && params.experimentId != null) {
            axios.get("/experiment/" + params.experimentId).then((response: AxiosResponse) => {
                setExperiment(response.data);
                (response.data as ExperimentModel)?.devices.forEach(
                    (_device) => {
                        _device.enabledServices.forEach(
                            (service) => {
                                axios.get("/dashboard/" + params.experimentId + "/device/" + service).then((response: AxiosResponse) => {
                                    const dashboardsData = response.data as Array<LineChartDataModel>;
                                    dashboardsData.forEach(
                                        (dashboard) => {
                                            const ref = createRef<ReactECharts>();
                                            setRefs(
                                                prev => {
                                                    return {
                                                        ...prev,
                                                        [dashboard.id]: ref
                                                    }
                                                }
                                            );
                                            refsRef.current[dashboard.id] = ref;
                                            setDashboards(prev => {
                                                return {
                                                    ...prev,
                                                    [dashboard.id]: dashboard
                                                }
                                            });
                                            dashboardsRef.current[dashboard.id] = dashboard;
                                            const id = window.setInterval(() => {
                                                axios.get("/dashboard/" + params.experimentId + "/device/" + service).then((response: AxiosResponse) => {
                                                    const dashboardsData = response.data as Array<LineChartDataModel>;
                                                    dashboardsData.forEach(
                                                        (dashboard) => {
                                                            dashboardsRef.current[dashboard.id] = {
                                                                ...dashboardsRef.current[dashboard.id],
                                                                categories: dashboardsRef.current[dashboard.id].categories.concat(dashboard.categories),
                                                                data: dashboardsRef.current[dashboard.id].data.concat(dashboard.data)
                                                            }
                                                            if (dashboardsRef.current[dashboard.id].categories.length > 10000) {
                                                                dashboardsRef.current[dashboard.id].categories = dashboardsRef.current[dashboard.id].categories.slice(dashboardsRef.current[dashboard.id].categories.length - 10000);
                                                            }
                                                            if (dashboardsRef.current[dashboard.id].data.length > 10000) {
                                                                dashboardsRef.current[dashboard.id].data = dashboardsRef.current[dashboard.id].data.slice(dashboardsRef.current[dashboard.id].data.length - 10000);
                                                            }
                                                            refsRef.current[dashboard.id].current!.getEchartsInstance().setOption({
                                                                xAxis: {
                                                                    type: 'category',
                                                                    data: dashboardsRef.current[dashboard.id].categories,
                                                                },
                                                                series: [
                                                                    {
                                                                        data: dashboardsRef.current[dashboard.id].data,
                                                                        type: 'line',
                                                                        smooth: true
                                                                    }
                                                                ]
                                                            });
                                                        }
                                                    );
                                                });
                                            }, 5000);
                                            intervalRefs.current.push(id);
                                        }
                                    );
                                });
                            }
                        );
                    }
                )
            })
        }
        return () => {
            intervalRefs.current.forEach(id => clearInterval(id));
            intervalRefs.current = [];
        }
    }, [params]);

    const chartOptions = (dashboard: LineChartDataModel) => {
        return {
            title: {
                left: 'center',
                text: dashboard.sensorName
            },
            tooltip: {
                trigger: 'item'
            },
            xAxis: {
                type: 'category',
                data: dashboard.categories
            },
            yAxis: {
                type: 'value'
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 85,
                    end: 100
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 85,
                    end: 100
                }
            ],
            series: [
                {
                    data: dashboard.data,
                    type: 'line',
                    smooth: true
                }
            ]
        }
    }
    const getDashboard = () => {
        const result = [];
        for (const dashboardsKey in dashboards) {
            const dashboard = dashboards[dashboardsKey];
            const ref = refs[dashboardsKey];
            result.push(
                (<ReactECharts ref={ref} key={dashboard.id} option={chartOptions(dashboard)}/>)
            )
        }
        return result;
    }

    return (
        <>
            {
                experiment != null && (
                    <div className={'mb-5'}>
                        <h3 className={'text-2xl! text-center'}>{experiment.experimentName} Dashboard</h3>
                    </div>
                )
            }
            <>
                {
                    getDashboard()
                }
            </>
        </>
    )
}