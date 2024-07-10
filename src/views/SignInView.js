import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {APIClient, APIClientSecure} from "../api";
import {config} from "../config";
import useAuth from "../hooks/useAuth";
import usePrivateAPIClient from "../hooks/usePrivateClient";
import {Box, Button, FormControl, TextField} from "@mui/material";

export const SignInView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuth} = useAuth();

    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await APIClientSecure.post(
                config.api.auth.token,
                {
                    username, password
                },
            );

            const data = await response.data;
            console.log(data);
            setAuth({username});
            navigate("/");
        } catch (error) {
            console.log(error);
            switch (error?.response?.status) {
                case 401:
                    console.log("Unauthorized");
                    break;
                default:
                    console.log("No server response");
                    break;
            }
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                background: "linear-gradient(rgba(255, 255, 255, 0.1) 0%, rgb(0, 0, 0) 100%)"
            }}
        >
            <Box
                component="form"
                autocomplete="off"
                noValidate
                sx={{
                    width: "30%",
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    transform: "translate(-50%, 0%)",
                    background: "#121212",
                    color: "white",
                    padding: "3rem",
                    margin: "1rem auto",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    gap: "1rem",
                    borderRadius: 1,
                    alignItems: "center",
                    boxShadow: "0 10px 20px 0px black",
                }}
            >
                <FormControl>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        sx={{
                            background: "#2a2a2a",
                            color: "#fff",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#f4f4f4'
                                },
                            }
                        }}
                        onChange={
                            (event) => setUsername(event.target.value)
                        }
                        required
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Password"
                        onChange={
                            (event) => setPassword(event.target.value)
                        }
                        sx={{
                            background: "#2a2a2a",
                            color: "#fff",
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
                                '& .MuiInputBase-input': {
                                    color: 'white',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#757575'
                                },
                            }
                        }}
                        required
                    />
                </FormControl>
                <FormControl>
                    <Button
                        sx={{
                            width: "100%",
                        }}
                        variant="contained"
                        onClick={submit}
                    >
                        Sign In
                    </Button>
                </FormControl>

            </Box>
        </Box>
    );
};


export default SignInView

