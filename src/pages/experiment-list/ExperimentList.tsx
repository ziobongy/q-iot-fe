import {
    Button, Card, CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {useEffect, useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import "./ExperimentListCss.css";
import {useNavigate} from "react-router";
import axios from "../../configurations/AxiosConfig.ts";
import type ExperimentModel from "../../model/ExperimentModel.ts";
import ShowChartIcon from '@mui/icons-material/ShowChart';

export default function ExperimentList() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Array<ExperimentModel>>([]);
    useEffect(() => {
        axios.get("/experiment").then(
            res => {
                setRows(res.data);
            }
        ).catch(
            err => {
                console.error("Error saving experiment:", err);
            }
        )
    }, []);
    return (
        <>
            <div className={'mb-5'}>
                <h3>Experiments</h3>
            </div>
            <div className={'mb-5'}>
                <Card className={'p-0'}>
                    <CardContent>
                        <Button onClick={() => navigate('/experiment/create')} color="primary">
                            Add Experiment
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Experiment Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.experimentName}
                                </TableCell>
                                <TableCell>
                                    <Button>
                                        <ShowChartIcon onClick={() => navigate('/experiment/dashboard/' + row.id)}/>
                                    </Button>
                                    <Button>
                                        <EditIcon onClick={() => navigate('/experiment/edit/' + row.id)}/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}