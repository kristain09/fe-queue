"use client";
import React, {useState} from "react";
import {Box, Modal, Stack, TextField, Button, Snackbar, Alert} from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

type CreateJobModalProps = {
    open: boolean;
    handleClose: () => void;
    onJobCreated: () => void;
};

export default function CreateJobModal({open, handleClose, onJobCreated}: CreateJobModalProps) {
    const [jobName, setJobName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobName(e.target.value);
        if (e.target.value.length >= 3) {
            setError(null);
        }
    };

    const createJob = async () => {
        if (jobName.length < 3) {
            setError("Job name must be at least 3 characters");
            return;
        }

        const response: Response = await fetch("/api/job", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({jobName}),
        })

        if (response.ok) {
            setSnackbar({open: true, message: "Job created successfully", severity: "success"});
            handleClose();
            setJobName("");
            onJobCreated();
        } else {
            const errorData = await response.json();
            setSnackbar({open: true, message: `Error: ${errorData.message || "Unknown error"}`, severity: "error"});
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            await createJob();
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({open: false, message: "", severity: "success"});
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack spacing={2}>
                        <TextField
                            id="job-name"
                            label="Job Name"
                            variant="outlined"
                            fullWidth
                            value={jobName}
                            onChange={handleInputChange}
                            error={!!error}
                            helperText={error}
                            onKeyDown={handleKeyDown}
                        />
                        <Button variant="contained" onClick={createJob} fullWidth>
                            Create
                        </Button>
                    </Stack>
                </Box>
            </Modal>

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
        </>
    );
}
