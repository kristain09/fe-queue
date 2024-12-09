"use client"
import React, {useEffect, useState} from "react";
import {JobList} from "@/app/components/joblist";
import Navbar from "@/app/components/navbar";
import {Box} from "@mui/material";

export default function Home() {
    const [jobs, setJobs] = useState([]); // State untuk menyimpan data pekerjaan

    useEffect(() => {
        const fetchJobs = async () => {

            const response = await fetch("http://localhost:5111/api/job", {
                method: "GET",
                mode: "cors",
            });

            const data = await response.json();
            setJobs(data);
        };

        const intervalId = setInterval(fetchJobs, 200);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <main>
            <Navbar></Navbar>
            <Box justifyContent="center" py={2}>
                <JobList jobs={jobs}/>
            </Box>
        </main>
    );
}



