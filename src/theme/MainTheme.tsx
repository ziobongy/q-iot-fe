import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {useState} from "react";
import {useNavigate} from "react-router";

export default function MainTheme({children}: {children: React.ReactNode}) {
    const [open, setOpen] =  useState(false);
    const navigate = useNavigate();
    const toggleDrawer = () => {
        setOpen(!open);
    }
    return (
        <>
            <Drawer open={open} onClose={toggleDrawer}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
                    <List>
                        <ListItem key={"experiment-list"} disablePadding>
                            <ListItemButton onClick={() => navigate("/experiment")}>
                                <ListItemIcon>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Lista Esperimenti"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={"sensor-list"} disablePadding>
                            <ListItemButton onClick={() => navigate("/sensor")}>
                                <ListItemIcon>
                                    <FormatListBulletedIcon />
                                </ListItemIcon>
                                <ListItemText primary={"Lista Sensori"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Q-IoT
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <div className={'mt-3 ms-5 me-5'}>
                {children}
            </div>
        </>
    )
}