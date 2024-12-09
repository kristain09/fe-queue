"use client";

import React, { useState } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { Job, JobListProps } from "@/app/type/jobtype";

const formatDate = (unix: number) => {
    const date = new Date(unix);
    const day = date.toLocaleDateString("id-ID");
    const time = date.toLocaleTimeString("id-ID", { hour12: false });
    return { day, time };
};

export function JobList({ jobs }: JobListProps) {
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [loadingJobId, setLoadingJobId] = useState<string | null>(null); // Track loading per job

    const handleSnackbarClose = () => {
        setSnackbar({ open: false, message: "", severity: "success" });
    };

    const handleRetry = async (job: Job, retryCount = 3): Promise<void> => {
        let success = false;
        setLoadingJobId(job.jobId);

        for (let attempt = 1; attempt <= retryCount && !success; attempt++) {


            const response = await fetch(`/api/job/${job.jobId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                success = true;
                setSnackbar({
                    open: true,
                    message: `Success to retry job with name: ${job.jobName}`,
                    severity: "success",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: `failed to retry job for-${attempt} times with name ${job.jobName}`,
                    severity: "error",
                });
            }

            await new Promise((resolve) => setTimeout(resolve, 12000));
        }

        if (!success) {
            setSnackbar({
                open: true,
                message: `Failed to retry ${job.jobName}, ${retryCount} times`,
                severity: "error",
            });
        }

        setLoadingJobId(null);
    };

    if (!jobs || jobs.length === 0) {
        return (
            <Paper sx={{ padding: 2, textAlign: "center" }}>
                <p>No jobs available</p>
            </Paper>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ width: "80%", justifyContent: "center", margin: "auto" }}>
                <Table sx={{ minWidth: 650, backgroundColor: "#121212" }} aria-label="jobs table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ color: "#bbb" }}>
                                Name
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#bbb" }}>
                                Date
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#bbb" }}>
                                Time
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#bbb" }}>
                                Status
                            </TableCell>
                            <TableCell align="center" sx={{ color: "#bbb" }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map((job: Job) => {
                            const { day, time } = formatDate(job.jobDate);

                            let statusColor: string;

                            if (job.status === "Failed") {
                                statusColor = "red";
                            } else if (job.status === "Rejected") {
                                statusColor = "yellow";
                            } else {
                                statusColor = "lightGreen";
                            }

                            return (
                                <TableRow
                                    key={job.jobId}
                                    sx={{
                                        "&:last-child td, &:last-child th": { border: 0 },
                                        "&:hover": { backgroundColor: "#1e1e1e" },
                                    }}
                                >
                                    <TableCell align="center" sx={{ color: "#fff" }}>
                                        {job.jobName}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#fff" }}>
                                        {day}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#fff" }}>
                                        {time}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: statusColor }}>
                                        {job.status}
                                    </TableCell>
                                    <TableCell align="center">
                                        {job.status === "Failed" && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    color: "#fff",
                                                    backgroundColor: "#f44336",
                                                    "&:hover": { backgroundColor: "#d32f2f" },
                                                }}
                                                onClick={() => handleRetry(job)}
                                                disabled={loadingJobId === job.jobId}
                                            >
                                                {loadingJobId === job.jobId ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    "Retry"
                                                )}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
