"use client"
import React, {useEffect, useState} from "react";
import {JobList} from "@/app/components/joblist";
import Navbar from "@/app/components/navbar";
import {Alert, Box, Snackbar} from "@mui/material";


export default function Home() {
    const [jobs, setJobs] = useState([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleSnackbarClose = () => {
        setSnackbar({open: false, message: "", severity: "success"});
    };

    const getListJob = async () => {
        try {
            const response = await fetch("http://localhost:5111/api/job", {
                method: "GET",
            });

            if (!response.ok) {
                if (response.status === 500) {
                    setSnackbar({
                        open: true,
                        message: "Server error",
                        severity: "error",
                    });
                    return;
                }

                const errorData = await response.json();
                setSnackbar({
                    open: true,
                    message: `Error: ${errorData.message || "Service unavailable"}`,
                    severity: "error",
                });
                return;
            }

            const data = await response.json();
            setJobs(data);
        } catch {
            setSnackbar({
                open: true,
                message: "Service Unavailable",
                severity: "error",
            });
        }
    };

    useEffect(() => {
        const intervalId = setInterval(getListJob, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <main>
            <Navbar jobCreatedCallBack={getListJob}></Navbar>
            <Box justifyContent="center" py={2}>
                <JobList jobs={jobs}/>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{width: "100%"}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </main>
    );
}



