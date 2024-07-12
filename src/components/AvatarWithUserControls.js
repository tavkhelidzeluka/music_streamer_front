import useAuth from "../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Avatar, Box, IconButton, ListItemText, MenuItem, MenuList, Popover, Tooltip} from "@mui/material";

export const AvatarWithUserControls = ({size = 24}) => {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'avatar-popover' : undefined;

    return (
        <>
            <Tooltip title={auth.username}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ml: 2}}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar
                        alt={auth.username}
                        sx={{width: size, height: size}}
                    />
                </IconButton>
            </Tooltip>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{
                    '& .MuiPaper-root': {
                        marginTop: "1rem",
                        backgroundColor: '#282828',
                        color: 'white',
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box>
                    <MenuList
                        sx={{
                            p: 0.5,
                            width: 200,
                        }}
                    >
                        <MenuItem
                            sx={{
                                "&:hover": {
                                    backgroundColor: '#3e3e3e',
                                }
                            }}
                        >
                            <ListItemText
                                onClick={() => navigate("/sign/out/")}
                            >
                                Sign Out
                            </ListItemText>
                        </MenuItem>
                    </MenuList>
                </Box>
            </Popover>
        </>
    )
};


export default AvatarWithUserControls;
