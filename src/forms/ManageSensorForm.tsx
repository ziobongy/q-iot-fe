import type FormComponentModel from "../model/FormComponentModel.ts";
import {Button, Card, CardContent, IconButton, TextField, Typography} from "@mui/material";
import {type ReactNode, useEffect, useState} from "react";
import type SensorModel from "../model/SensorModel.ts";
import type { CharacteristicModel, ServiceModel } from "../model/SensorModel.ts";
import DeleteIcon from '@mui/icons-material/Delete';

export default function ManageSensorForm(f: FormComponentModel<SensorModel>) {

    const [sensor, setSensor] = useState<SensorModel>(
        {
            name: '',
            shortName: '',
            services: [],
            dynamicSchema: [],
            dynamicJson: {}
        }
    );


    useEffect(() => {
        if (f.initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSensor(f.initialData);
        }
    }, [f.initialData]);

    const manageSubmit = (e: any) => {
        e.preventDefault();
        if (e.currentTarget != null) {
            f.onSubmit(
                formDataToNestedObject(new FormData(e.currentTarget))
            );
        }
    }

    function formDataToNestedObject(formData: FormData) {
        const result: SensorModel = {
            name: formData.get("sensor-name") as string,
            shortName: formData.get("sensor-shortName") as string,
            services: []
        }
        let j = 0;
        while (formData.has('service-uuid[' + j + ']')) {
            const service: ServiceModel = {
                uuid: formData.get('service-uuid[' + j + ']') as string,
                name: formData.get('service-name[' + j + ']') as string,
                characteristics: []
            };
            let k = 0;
            while (formData.has('characteristic-uuid[' + j + '][' + k + ']')) {
                const characteristic: CharacteristicModel = {
                    uuid: formData.get('characteristic-uuid[' + j + '][' + k + ']') as string,
                    name: formData.get('characteristic-name[' + j + '][' + k + ']') as string,
                    mqttTopic: formData.get('characteristic-uuid[' + j + '][' + k + ']') as string + '-topic',
                    structParser: {
                        endianness: formData.get('struct-parser-endianness[' + j + '][' + k + ']') as string,
                        fields: []
                    }
                };
                let i = 0;
                while (formData.has('struct-parser-name[' + j + '][' + k + '][' + i + ']')) {
                    characteristic.structParser.fields.push(
                        {
                            name: formData.get('struct-parser-name[' + j + '][' + k + '][' + i + ']') as string,
                            type: formData.get('struct-parser-type[' + j + '][' + k + '][' + i + ']') as string
                        }
                    );
                    i++;
                }
                service.characteristics.push(characteristic);
                k++;
            }
            result.services.push(service);
            j++;
        }
        return result;
    }
    const addService = () => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: [
                        ...prevState.services,
                        {
                            uuid: '',
                            name: '',
                            characteristics: []
                        }
                    ]
                }
            }
        )
    }
    const addCharacteristic = (serviceIndex: number) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: [
                                    ...prevState.services[serviceIndex].characteristics,
                                    {
                                        uuid: '',
                                        name: '',
                                        mqttTopic: '',
                                        structParser: {
                                            endianness: '',
                                            fields: []
                                        }
                                    }
                                ]
                            }
                        ]
                    ).concat(prevState.services.slice(serviceIndex + 1))
                }
            }
        );
    }
    const addFieldToStructParser = (serviceIndex: number, characteristicIndex: number) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: prevState.services[serviceIndex].characteristics.slice(0, characteristicIndex).concat(
                                    [
                                        {
                                            ...prevState.services[serviceIndex].characteristics[characteristicIndex],
                                            structParser: {
                                                ...prevState.services[serviceIndex].characteristics[characteristicIndex].structParser,
                                                fields: [
                                                    ...prevState.services[serviceIndex].characteristics[characteristicIndex].structParser.fields,
                                                    {
                                                        name: '',
                                                        type: ''
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                ).concat(prevState.services[serviceIndex].characteristics.slice(characteristicIndex + 1))
                            }
                        ]
                    ).concat(prevState.services.slice(serviceIndex + 1))
                }
            }
        );
    }
    const structParserFieldsChange = (serviceIndex: number, characteristicIndex: number, fieldIndex: number, fieldName: string, value: any) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: prevState.services[serviceIndex].characteristics.slice(0, characteristicIndex).concat(
                                    [
                                        {
                                            ...prevState.services[serviceIndex].characteristics[characteristicIndex],
                                            structParser: {
                                                ...prevState.services[serviceIndex].characteristics[characteristicIndex].structParser,
                                                fields: prevState.services[serviceIndex].characteristics[characteristicIndex].structParser.fields.slice(0, fieldIndex).concat(
                                                    [
                                                        {
                                                            ...prevState.services[serviceIndex].characteristics[characteristicIndex].structParser.fields[fieldIndex],
                                                            [fieldName]: value
                                                        }
                                                    ]
                                                ).concat(prevState.services[serviceIndex].characteristics[characteristicIndex].structParser.fields.slice(fieldIndex + 1))
                                            }
                                        }
                                    ]
                                ).concat(prevState.services[serviceIndex].characteristics.slice(characteristicIndex + 1))
                            }
                        ]
                    ).concat(prevState.services.slice(serviceIndex + 1))
                }
            }
        );
    }
    const manageRemoveStructParserField = (serviceIndex: number, characteristicIndex: number, fieldIndex: number) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: prevState.services[serviceIndex].characteristics.slice(0, characteristicIndex).concat(
                                    [
                                        {
                                            ...prevState.services[serviceIndex].characteristics[characteristicIndex],
                                            structParser: {
                                                ...prevState.services[serviceIndex].characteristics[characteristicIndex].structParser,
                                                fields: prevState.services[serviceIndex].characteristics[characteristicIndex].structParser.fields.slice(0, fieldIndex).concat(
                                                    prevState.services[serviceIndex].characteristics[characteristicIndex].structParser.fields.slice(fieldIndex + 1)
                                                )
                                            }
                                        }
                                    ]
                                )
                            }
                        ]
                    )
                }
            }
        )
    }
    const structParserFieldSection = (serviceIndex: number, characteristicIndex: number, fieldIndex: number) => {
        return (
            <>
                <div key={serviceIndex + '-' + characteristicIndex + '-' + fieldIndex} className={'grid grid-cols-10 gap-3'}>
                    <TextField
                        value={sensor.services[serviceIndex].characteristics[characteristicIndex].structParser.fields[fieldIndex]?.name}
                        onChange={(e) => structParserFieldsChange(serviceIndex, characteristicIndex, fieldIndex, 'name', e.target.value)}
                        className={'col-span-4'}
                        name={'struct-parser-name[' + serviceIndex + '][' + characteristicIndex + '][' + fieldIndex + ']'}
                        label="Field Name"
                        variant="standard"
                    />
                    <TextField
                        value={sensor.services[serviceIndex].characteristics[characteristicIndex].structParser.fields[fieldIndex]?.type}
                        onChange={(e) => structParserFieldsChange(serviceIndex, characteristicIndex, fieldIndex, 'type', e.target.value)}
                        className={'col-span-4'}
                        name={'struct-parser-type[' + serviceIndex + '][' + characteristicIndex + '][' + fieldIndex + ']'}
                        label="Field Type"
                        variant="standard"
                    />
                    <IconButton onClick={() => manageRemoveStructParserField(serviceIndex, characteristicIndex, fieldIndex)} aria-label="delete" size="large">
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </div>
            </>
        );
    }
    const characteristicFieldChanged = (serviceIndex: number, characteristicIndex: number, fieldName: string, value: any) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: prevState.services[serviceIndex].characteristics.slice(0, characteristicIndex).concat(
                                    [
                                        {
                                            ...prevState.services[serviceIndex].characteristics[characteristicIndex],
                                            [fieldName]: value
                                        }
                                    ]
                                ).concat(prevState.services[serviceIndex].characteristics.slice(characteristicIndex + 1))
                            }
                        ]
                    ).concat(prevState.services.slice(serviceIndex + 1))
                }
            }
        );
    }
    const structParserFieldChanged = (serviceIndex: number, characteristicIndex: number, fieldName: string, value: any) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: prevState.services[serviceIndex].characteristics.slice(0, characteristicIndex).concat(
                                    [
                                        {
                                            ...prevState.services[serviceIndex].characteristics[characteristicIndex],
                                            structParser: {
                                                ...prevState.services[serviceIndex].characteristics[characteristicIndex].structParser,
                                                [fieldName]: value
                                            }
                                        }
                                    ].concat(prevState.services[serviceIndex].characteristics.slice(characteristicIndex + 1)))
                            }
                        ]
                    ).concat(prevState.services.slice(serviceIndex + 1))
                }
            }
        );
    }
    const characteristicSection = (serviceIndex: number, characteristicIndex: number) => {
        return (
            <>
                <div key={serviceIndex + '-' + characteristicIndex}>
                    <div className={'grid grid-cols-2 gap-3'}>
                        <TextField
                            value={sensor.services[serviceIndex].characteristics[characteristicIndex]?.uuid}
                            onChange={(e) => characteristicFieldChanged(serviceIndex, characteristicIndex, 'uuid', e.target.value)}
                            name={'characteristic-uuid[' + serviceIndex + '][' + characteristicIndex + ']'}
                            label="UUID"
                            variant="standard"
                        />
                        <TextField
                            value={sensor.services[serviceIndex].characteristics[characteristicIndex]?.name}
                            onChange={(e) => characteristicFieldChanged(serviceIndex, characteristicIndex, 'name', e.target.value)}
                            name={'characteristic-name[' + serviceIndex + '][' + characteristicIndex + ']'}
                            label="Name"
                            variant="standard"
                        />
                    </div>
                    <div className={'grid grid-cols-2 gap-3 mt-5'}>
                        <div className={'col-span-2'}>
                            Struct Parser
                        </div>
                        <TextField
                            value={sensor.services[serviceIndex].characteristics[characteristicIndex]?.structParser?.endianness}
                            onChange={(e) => structParserFieldChanged(serviceIndex, characteristicIndex, 'endianness', e.target.value)}
                            className={'col-span-10'}
                            name={'struct-parser-endianness[' + serviceIndex + '][' + characteristicIndex + ']'}
                            label="Endianness"
                            variant="standard"
                        ></TextField>
                        <Button className={'col-span-10'} onClick={() => addFieldToStructParser(serviceIndex, characteristicIndex)} color='primary'>
                            Add Field to Struct Parser
                        </Button>
                        <div className={'col-span-10'}>
                            {
                                sensor.services[serviceIndex].characteristics[characteristicIndex].structParser != null &&
                                sensor.services[serviceIndex].characteristics[characteristicIndex].structParser.fields != null &&
                                sensor.services[serviceIndex].characteristics[characteristicIndex].structParser.fields.map(
                                    (_, idx) => structParserFieldSection(serviceIndex, characteristicIndex, idx)
                                )
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
    const serviceFieldChanged = (serviceIndex: number, fieldName: string, value: any) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                [fieldName]: value
                            }
                        ]
                    ).concat(prevState.services.slice(serviceIndex + 1))
                }
            }
        );
    }
    const manageRemoveCharacteristic = (serviceIndex: number, characteristicIndex: number) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, serviceIndex).concat(
                        [
                            {
                                ...prevState.services[serviceIndex],
                                characteristics: prevState.services[serviceIndex].characteristics.slice(0, characteristicIndex).concat(
                                    prevState.services[serviceIndex].characteristics.slice(characteristicIndex + 1)
                                )
                            }
                        ]
                    )
                }
            }
        )
    }
    const serviceSection = (serviceIndex: number) => {
        return (
            <>
                <div key={"service-" + serviceIndex}>
                    <div className={'grid grid-cols-2 gap-3'}>
                        <TextField
                            value={sensor.services[serviceIndex]?.uuid}
                            onChange={(e) => serviceFieldChanged(serviceIndex, 'uuid', e.target.value)}
                            name={'service-uuid[' + serviceIndex + ']'}
                            label="UUID"
                            variant="standard"
                        />
                        <TextField
                            value={sensor.services[serviceIndex].name}
                            onChange={(e) => serviceFieldChanged(serviceIndex, 'name', e.target.value)}
                            name={'service-name[' + serviceIndex + ']'}
                            label=" Name" variant="standard"
                        />
                    </div>
                </div>
                <Button onClick={() => addCharacteristic(serviceIndex)} color='primary'>
                    Add Characteristic
                </Button>
                <div className={'grid grid-cols-2 gap-4'}>
                    {
                        sensor.services[serviceIndex].characteristics.map(
                            (_, idx) => (
                                <Card>
                                    <CardContent>
                                        <div className={'grid grid-cols-1 gap-5'}>
                                            <Typography variant={'h6'}>
                                                Characteristic {idx + 1}
                                                <IconButton onClick={() => manageRemoveCharacteristic(serviceIndex, idx)} aria-label="delete" size="large">
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Typography>
                                            {characteristicSection(serviceIndex, idx)}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )
                    }
                </div>
            </>
        );
    }
    const changeSensorField = (fieldName: string, value: any) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    [fieldName]: value
                }
            }
        );
    }
    const manageRemoveService = (index: number) => {
        setSensor(
            prevState => {
                return {
                    ...prevState,
                    services: prevState.services.slice(0, index).concat(
                        prevState.services.slice(index + 1)
                    )
                }
            }
        )
    }
    const sensorSection: () => ReactNode = () => {
        return (
            <>
                <div className={'grid grid-cols-2 gap-3'}>
                    <TextField
                        value={sensor.name}
                        onChange={(e) => changeSensorField('name', e.target.value)}
                        name={'sensor-name'}
                        label="Sensor Name"
                        variant="standard"
                    />
                    <TextField
                        value={sensor.shortName}
                        onChange={(e) => changeSensorField('shortName', e.target.value)}
                        name={'sensor-shortName'}
                        label="Short Name"
                        variant="standard"
                    />
                    <Button className={'col-span-2'} onClick={() => addService()} color='primary'>
                        Add Service
                    </Button>
                </div>
                <div className={'grid grid-cols-2 gap-4 mt-5'}>
                    {
                        sensor.services.map(
                            (_, idx) => (
                                <Card>
                                    <CardContent>
                                        <div className={'grid grid-cols-1 gap-5'}>
                                            <Typography variant={'h4'}>
                                                Service {idx + 1}
                                                <IconButton onClick={() => manageRemoveService(idx)} aria-label="delete" size="large">
                                                    <DeleteIcon fontSize="inherit" />
                                                </IconButton>
                                            </Typography>
                                            {serviceSection(idx)}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )
                    }
                </div>
            </>
        );
    }

    const updateJsonResult = (json: any) => {
        f.onUpdate?.(
            {
                schema: [],
                jsonResult: json
            }
        );
    }

    return (
        <form id={'manage-sensor-form'} onSubmit={manageSubmit}>
            {
                sensorSection()
            }
            <div className="mt-8">
                <label htmlFor="json-textarea">JSON avanzato (dynamicJson)</label>
                <TextField
                    id="standard-multiline-flexible"
                    label="Multiline"
                    multiline
                    maxRows={4}
                    variant="standard"
                    value={JSON.stringify(f.initialData?.dynamicJson)}
                    onChange={(e) => updateJsonResult(JSON.parse(e.target.value))}
                    fullWidth
                />
            </div>
        </form>
    );
}