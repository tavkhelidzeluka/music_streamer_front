import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {APIClientSecure} from "../api";
import {config} from "../config";
import useAuth from "../hooks/useAuth";
import * as yup from 'yup';
import {Box, Button, FormControl, TextField} from "@mui/material";
import {useFormik} from "formik";

const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .required('Name is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required'),
});

const AuthField = ({...props}) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            sx={{
                background: "#2a2a2a",
                color: "#fff",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                    '& .MuiInputBase-input': {
                        color: 'white',
                    },
                },
                '& .MuiInputLabel-root': {
                    color: 'white'
                }
            }}
            required
            {...props}
        />
    );
};


export const SignInView = () => {
        const {setAuth} = useAuth();

        const navigate = useNavigate();


        const formik = useFormik({
            initialValues: {
                username: '',
                password: '',
            },
            validationSchema: validationSchema,
            onSubmit: async (values, {setFieldError, setSubmitting}) => {
                const {username, password} = values;
                try {
                    const response = await APIClientSecure.post(
                        config.api.auth.token,
                        {
                            username, password
                        },
                    );

                    await response.data;
                    const auth = {username};
                    setAuth(auth);
                    localStorage.setItem("user", JSON.stringify(auth));
                    navigate("/");
                } catch (error) {
                    setFieldError("username", "Check Username");
                    setFieldError("password", "Check Password");
                } finally {
                    setSubmitting(false);
                }
            }
        });

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
                    onSubmit={formik.handleSubmit}
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
                        <AuthField
                            label="Username"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <AuthField
                            label="Password"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    </FormControl>
                    <FormControl>
                        <Button
                            sx={{
                                width: "100%",
                            }}
                            variant="contained"
                            type="submit"
                        >
                            Sign In
                        </Button>
                    </FormControl>
                </Box>
            </Box>
        );
    }
;


export default SignInView

