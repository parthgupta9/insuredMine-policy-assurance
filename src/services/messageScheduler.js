function startScheduler() {
  cron.schedule("* * * * *", async () => {

    console.log(
      "Scheduler Running:",
      new Date()
    );

    const now = new Date();

    const pendingJobs =
      await ScheduledMessage.find({
        status: "pending",
        scheduledAt: {
          $lte: now,
        },
      });

    console.log(
      "Pending Jobs:",
      pendingJobs.length
    );

    for (const job of pendingJobs) {

      console.log(
        "Executing Job:",
        job._id
      );

      await Message.create({
        message: job.message,
      });

      job.status = "completed";

      await job.save();
    }
  });
}