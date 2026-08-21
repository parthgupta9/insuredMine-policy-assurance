const ScheduledMessage =
  require(
    "../models/ScheduledMessage"
  );

exports.scheduleMessage =
  async (req, res) => {
    try {

      const {
        message,
        day,
        time,
      } = req.body;

      const scheduledAt =
        new Date(
          `${day}T${time}:00`
        );

      const job =
        await ScheduledMessage.create(
          {
            message,
            scheduledAt,
          }
        );

      return res.status(201).json({
        success: true,
        job,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };