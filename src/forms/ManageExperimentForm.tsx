import type FormComponentModel from "../model/FormComponentModel.ts";
import {
    Button,
    Card, CardContent,
    Checkbox,
    FormControl,
    FormControlLabel, IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField, Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import type ExperimentModel from "../model/ExperimentModel.ts";
import type { ExperimentDeviceModel } from "../model/ExperimentModel.ts";
import type SensorModel from "../model/SensorModel.ts";
import axios from "../configurations/AxiosConfig.ts";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ManageExperimentForm(f: FormComponentModel<ExperimentModel>) {

    const [experiment, setExperiment] = useState<ExperimentModel>(
        {
            experimentName: '',
            devices: []
        }
    );
    const [sensors, setSensors] = useState<SensorModel[]>([]);
    useEffect(() => {
        axios.get("/sensor").then(
            result => {
                setSensors(result.data);
            }
        )
    }, []);
    useEffect(() => {
        if (f.initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setExperiment(f.initialData);
        }
    }, [f.initialData]);

    const manageSubmit = (e: any) => {
        e.preventDefault();
        if (e.currentTarget != null) {
            f.onSubmit(formDataToNestedObject(new FormData(e.currentTarget)));
        }
    }

    function formDataToNestedObject(formData: FormData) {
        const result: ExperimentModel = {
            experimentName: formData.get("experiment-name") as string,
            devices: []
        }
        let j = 0;
        while (formData.has('sensor-id[' + j + ']')) {
            const device: ExperimentDeviceModel = {
                sensorId: formData.get('sensor-id[' + j + ']') as string,
                macAddress: formData.get('sensor-mac-address[' + j + ']') as string,
                enabledServices: []
            }
            let k = 0;
            while (formData.has('service-id[' + j + '][' + k + ']')) {
                const uuid: string = formData.get('service-id[' + j + '][' + k + ']') as string;
                if (formData.get('service-id[' + j + '][' + uuid + ']') === 'on') {
                    console.log("ecco qui");
                    device.enabledServices.push(uuid);
                }
                k++;
            }
            result.devices.push(device);
            j++;
        }
        return result;
    }

    const getSensorById = (id: unknown) => {
        const index = sensors.findIndex(s => s._id === id);
        if (index > -1) {
            return sensors[index];
        } else {
            return null;
        }
    }

    const addDevice = () => {
        setExperiment(
            prevState => {
                return {
                    ...prevState,
                    devices: (prevState.devices != null) ? [
                        ...prevState.devices,
                        {
                            macAddress: '',
                            sensorId: '',
                            enabledServices: []
                        }
                    ] : [
                        {
                            macAddress: '',
                            sensorId: '',
                            enabledServices: []
                        }
                    ]
                }
            }
        );
    }

    const deviceChange = (index: number, field: string, value: any) => {
        setExperiment((prevState) => {
            const updatedDevices = prevState.devices.map((device, idx) => {
                if (idx === index) {
                    return {
                        ...device,
                        [field]: value,
                    };
                }
                return device;
            });
            return {
                ...prevState,
                devices: updatedDevices,
            };
        });
    }
    const checkedService = (sensorIndex: number, serviceUuid: string) => {
        const device = experiment.devices[sensorIndex];
        if (device == null || device.enabledServices == null) {
            return false;
        }
        return device.enabledServices.includes(serviceUuid);
    }
    const selectService = (sensorIndex: number, serviceUuid: string, checked: boolean) => {
        setExperiment((prevState) => {
            const updatedDevices = prevState.devices.map((device, idx) => {
                if (idx === sensorIndex) {
                    let updatedEnabledServices = device.enabledServices || [];
                    if (checked) {
                        if (!updatedEnabledServices.includes(serviceUuid)) {
                            updatedEnabledServices = [...updatedEnabledServices, serviceUuid];
                        }
                    } else {
                        updatedEnabledServices = updatedEnabledServices.filter(uuid => uuid !== serviceUuid);
                    }
                    return {
                        ...device,
                        enabledServices: updatedEnabledServices,
                    };
                }
                return device;
            });
            return {
                ...prevState,
                devices: updatedDevices,
            };
        });
    }

    const characteristicSection = (sensorIndex: number) => {
        const sensor = getSensorById(experiment.devices[sensorIndex]?.sensorId);
        if (sensor == null) {
            return (
                <>
                    Nessun Servizio disponibile
                </>
            );
        } else {
            return (
                <div className={'grid grid-cols-1 gap-1'}>
                    <div>
                        Caratteristiche da portare nell'esperimento
                    </div>
                    <div className={'grid grid-cols-1 gap-1'}>
                        {
                            sensor.services.map((service, idx) => {
                                return (
                                    <>
                                        <input type="hidden" name={'service-id[' + sensorIndex + '][' + idx + ']'} value={service.uuid} />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id={service.uuid}
                                                    checked={checkedService(sensorIndex, service.uuid)}
                                                    onChange={event => selectService(sensorIndex, service.uuid, event.target.checked)}
                                                    name={'service-id[' + sensorIndex + '][' + service.uuid + ']'} />
                                            }
                                            label={service.name}
                                        />
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            )

        }
    }

    const deviceSection = (index: number) => {
        return (
            <>
                <div className={"grid grid-cols-2 gap-4"}>
                    <FormControl fullWidth>
                        <InputLabel>Sensor</InputLabel>
                        <Select
                            label="Age"
                            name={"sensor-id[" + index + ']'}
                            onChange={
                                (e) => {
                                    deviceChange(index, 'sensorId', e.target.value);
                                }
                            }
                            value={experiment.devices[index]?.sensorId || ''}
                        >
                            {
                                sensors.map((s) => (
                                    <MenuItem value={s._id}>
                                        {s.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <TextField
                        value={experiment.devices[index]?.macAddress || ''}
                        onChange={(e) => deviceChange(index, 'macAddress', e.target.value)}
                        className={'p-2'}
                        name={'sensor-mac-address[' + index + ']'}
                        label="Mac Address"
                        variant="standard"
                    />
                </div>
                {characteristicSection(index)}
            </>
        );
    }

    const experimentFieldChange = (field: string, value: any) => {
        setExperiment((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    }
    const manageRemoveDevice = (deviceIndex: number) => {
        setExperiment(
            (prevState) => {
                return {
                    ...prevState,
                    devices: prevState.devices.slice(0, deviceIndex).concat(
                        prevState.devices.slice(deviceIndex + 1)
                    )
                }
            }
        )
    }

    return (
        <form id={'manage-experiment-form'} onSubmit={manageSubmit}>
            <div className={"grid grid-cols-1 gap-1"}>
                <TextField
                    value={experiment.experimentName}
                    onChange={(e) => experimentFieldChange('experimentName', e.target.value)}
                    className={''} name={'experiment-name'}
                    label="Experiment Name" variant="standard"
                />
                <Button onClick={addDevice}>
                    Add Device
                </Button>
                <div className={'grid grid-cols-2 gap-5'}>
                    {
                        experiment.devices.map(
                            (_, index: number) => (
                                <Card>
                                    <CardContent>
                                        <div className={'grid grid-cols-1 gap-5'}>
                                            <Typography variant={'h4'}>
                                                Device {index + 1}
                                                <IconButton onClick={() => manageRemoveDevice(index)} aria-label="delete" size="large">
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Typography>
                                            {deviceSection(index)}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )
                    }
                </div>
            </div>
        </form>
    )
}