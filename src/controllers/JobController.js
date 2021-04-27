const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  create(req, res) {
    return res.render("job", { errors: undefined });
  },

  async save(req, res) {
    let errors = [];

    if (req.body.name == "" || req.body.name == null) {
      errors.push({ text: "Nome inválido" });
    }

    if (req.body["daily-hours"] == "" || req.body["daily-hours"] == null) {
      errors.push({ text: "Número de horas por dia é obrigatório" });
    }

    if (req.body["total-hours"] == "" || req.body["total-hours"] == null) {
      errors.push({ text: "Estimativas de horás para o job é obrigatória" });
    }

    const profile = await Profile.get();

    if (req.body["daily-hours"] > profile["hours-per-day"]) {
      errors.push({
        text: "O número de horas por dia excede as horas de trabalho diária",
      });
    }

    if (req.body["daily-hours"] > req.body["total-hours"]) {
      errors.push({
        text:
          "O número de horas por dia não pode ser maior que a estimativa de horas para o job",
      });
    }

    if (errors.length > 0) {
      return res.render("job", { errors });
    } else {
      await Job.create({
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(), // atribuindo data de hoje
        status: "progress",
      });

      return res.redirect("/");
    }
  },

  async show(req, res) {
    const jobId = req.params.id;
    const jobs = await Job.get();

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found");
    }

    const profile = await Profile.get();

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },

  async update(req, res) {
    const jobId = req.params.id;

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
      status: req.body.status,
    };

    await Job.update(updatedJob, jobId);

    res.redirect("/");
  },

  async delete(req, res) {
    const jobId = req.params.id;

    await Job.delete(jobId);

    return res.redirect("/");
  },
};
