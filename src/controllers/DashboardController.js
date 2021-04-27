const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    // total de horas por dia de jobs em progresso
    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      // ajustes no job
      const deadline = (job["total-hours"] / job["daily-hours"]).toFixed();
      const status = job.status === "progress" ? "progress" : "done";

      statusCount[status] += 1;

      jobTotalHours =
        status === "progress"
          ? jobTotalHours + Number(job["daily-hours"])
          : jobTotalHours;

      return {
        ...job,
        deadline,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    // qtd de horas/dia que quero trabalhar
    // menos
    // a quantidade de horas/dia de jobs em progress
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
