import ManageSensorForm from "../forms/ManageSensorForm.tsx";
import {Button, Typography} from "@mui/material";
import axios from "../configurations/AxiosConfig.ts";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import type {AxiosResponse} from "axios";
import type SensorModel from "../model/SensorModel.ts";

export default function ManageSensor() {

    const navigate = useNavigate();
    const params = useParams();
    const [sensor, setSensor] = useState<SensorModel | undefined>(undefined);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    useEffect(() => {
        if (params != null && params.sensorId != null) {
            axios.get("http://localhost:8080/sensor/" + params.sensorId).then((response: AxiosResponse) => {
                setSensor(response.data);
                setIsEditMode(true);
            })
        }
    }, [params]);

    const manageOnSubmit = (data: unknown) => {
        if (isEditMode) {
            axios.put("http://localhost:8080/sensor/" + sensor?._id, data).then(
                res => {
                    console.log("Sensor updated successfully:", res.data);
                    navigate("/sensor");
                }
            ).catch(
                err => {
                    console.error("Error saving sensor:", err);
                }
            )
        } else {
            axios.post("http://localhost:8080/sensor", data).then(
                res => {
                    console.log("Sensor saved successfully:", res.data);
                }
            ).catch(
                err => {
                    console.error("Error saving sensor:", err);
                }
            )
        }
    }
    const manageOnCancel = () => {}

    return (
        <>
            <div className={'mb-5'}>
                {
                    sensor ? (
                        <Typography variant={'h3'}>
                            Edit Sensor {sensor.name}
                        </Typography>
                    ) : (<Typography variant={'h3'}>
                            Create new Sensor Configuration
                        </Typography>
                    )
                }
            </div>
            <ManageSensorForm onCancel={manageOnCancel} onSubmit={manageOnSubmit} initialData={sensor}>
            </ManageSensorForm>
            <div className={"flex w-full z-50 p-5 shadow sticky bottom-0 bg-white h-5"}>
                <Button type='submit' form='manage-sensor-form' color='primary'>
                    Save
                </Button>
            </div>
        </>
    );
}