export type Job = {
    jobId: string;
    jobName: string;
    status: string;
    jobDate: number;
};

export interface JobListProps {
    jobs: Job[];
}