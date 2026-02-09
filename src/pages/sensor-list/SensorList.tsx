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
import "./SensorListCss.css";
import {useNavigate} from "react-router";
import axios from "../../configurations/AxiosConfig.ts";
import type SensorModel from "../../model/SensorModel.ts";

export default function SensorList() {
    const navigate = useNavigate();
    const [rows, setRows] = useState<Array<SensorModel>>([]);
    useEffect(() => {
        axios.get("/sensor").then(
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
                <h3>Configured Sensor</h3>
            </div>
            <div className={'mb-5'}>
                <Card className={'p-0'}>
                    <CardContent>
                        <Button onClick={() => navigate('/sensor/create')} color="primary">
                            Add Sensor
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Short Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.shortName}
                                </TableCell>
                                <TableCell>
                                    <Button>
                                        <EditIcon onClick={() => navigate('/sensor/edit/' + row._id)} />
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