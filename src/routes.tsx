import {createBrowserRouter} from "react-router";
import App from "./App.tsx";
import SensorList from "./pages/sensor-list/SensorList.tsx";
import ManageSensor from "./pages/ManageSensor.tsx";
import ExperimentList from "./pages/experiment-list/ExperimentList.tsx";
import ManageExperiment from "./pages/ManageExperiment.tsx";
import ExperimentDashboard from "./pages/ExperimentDashboard.tsx";

const router = createBrowserRouter(
    [
        {
            path: '',
            Component: App,
            children: [
                {
                    path: 'sensor',
                    Component: SensorList
                },
                {
                    path: 'sensor/edit/:sensorId',
                    Component: ManageSensor
                },
                {
                    path: 'sensor/create',
                    Component: ManageSensor
                },
                {
                    path: 'experiment',
                    Component: ExperimentList
                },
                {
                    path: 'experiment/create',
                    Component: ManageExperiment
                },
                {
                    path: 'experiment/edit/:experimentId',
                    Component: ManageExperiment
                },
                {
                    path: 'experiment/dashboard/:experimentId',
                    Component: ExperimentDashboard
                }
            ]

        }
    ]
);

export default router;