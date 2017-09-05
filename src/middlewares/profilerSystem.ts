class Profiler {
    private allRequestList: any;
    private startTime: any;
    public startProfiling(): void {
        this.startTime = process.hrtime();
        // console.log("start time: ", this.startTime);
    }

    public endProfiling(): string {
        const profiled = process.hrtime(this.startTime);
        return "Execution time (hr): " + profiled[0] + "s " + (profiled[1] / 1000000) + "ms";
    }
}

export default new Profiler();
