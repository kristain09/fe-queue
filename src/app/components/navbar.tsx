"use client";
import React, {useState} from "react";
import {Box, Button} from "@mui/material";
import {Stack} from "@mui/system";
import CreateJobModal from "@/app/components/create-job";
type NavBarModal = {
    jobCreatedCallBack : () => void;
};
export default function Navbar({jobCreatedCallBack}: NavBarModal) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    border: "1px solid",
                    px: "20px",
                    backgroundColor: 'steelblue',
                    color: "black"
                }}
                component="section"
            >
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <h1>Interview Queues</h1>
                    <Button variant="contained" onClick={handleOpen} color="primary">
                        New
                    </Button>
                </Stack>
            </Box>
            <CreateJobModal open={open} handleClose={handleClose} onJobCreated={jobCreatedCallBack} />
        </>
    );
}
