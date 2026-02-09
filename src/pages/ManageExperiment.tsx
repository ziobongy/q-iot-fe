import ManageExperimentForm from "../forms/ManageExperimentForm.tsx";
import {Button} from "@mui/material";
import axios from "../configurations/AxiosConfig.ts";
import type {AxiosResponse} from "axios";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import type ExperimentModel from "../model/ExperimentModel.ts";

export default function ManageExperiment() {
    const navigate = useNavigate();
    const params = useParams();
    const [experiment, setExperiment] = useState<ExperimentModel | undefined>(undefined);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    useEffect(() => {
        if (params != null && params.experimentId != null) {
            axios.get("/experiment/" + params.experimentId).then((response: AxiosResponse) => {
                setExperiment(response.data);
                setIsEditMode(true);
            })
        }
    }, [params]);
    const manageSubmit = (data: unknown) => {
        if (!isEditMode) {
            axios.post("/experiment", data).then((response: AxiosResponse) => {
                console.log("Experiment saved successfully:", response.data);
            })
        } else {
            axios.put("/experiment/" + params.experimentId, data).then((response: AxiosResponse) => {
                console.log("Experiment updated successfully:", response.data);
                navigate("/experiment");
            });
        }
    }
    return (
        <>
            <ManageExperimentForm onSubmit={manageSubmit} onCancel={() => {}} initialData={experiment} />
            <Button type='submit' form='manage-experiment-form' color='primary'>
                Save
            </Button>
        </>
    );
}