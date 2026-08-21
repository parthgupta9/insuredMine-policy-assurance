const Agent = require("../models/Agent");
const Carrier = require("../models/Carrier");
const LOB = require("../models/Lob");
const Account = require("../models/Account");

const User = require("../models/User");
const Policy = require("../models/Policy");

exports.searchPolicyByUser =
  async (req, res) => {
    try {

      const { username } =
        req.query;

      const user =
        await User.findOne({
          firstName: username,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      const policies =
        await Policy.find({
          userId: user._id,
        })
          .populate("agentId")
          .populate("carrierId")
          .populate("lobId")
          .populate("accountId");

      return res.status(200).json({
        success: true,
        user,
        policies,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

  exports.aggregatePolicies = async (
  req,
  res
) => {
  try {
    const data =
      await Policy.aggregate([
        {
          $group: {
            _id: "$userId",
            totalPolicies: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField:
              "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 0,
            firstName:
              "$user.firstName",
            email:
              "$user.email",
            totalPolicies: 1,
          },
        },
      ]);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};