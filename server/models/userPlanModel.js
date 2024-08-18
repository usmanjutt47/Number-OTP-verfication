const mongoose = require("mongoose");

const userPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  active: { type: Boolean, default: false },
  planDetails: { type: Object, required: true },
});

const userPlanModel = mongoose.model("UserPlan", userPlanSchema);

module.exports = userPlanModel;
