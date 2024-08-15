const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const wordCount = v.split(/\s+/).length;
        return wordCount <= 500;
      },
      message: (props) =>
        `Content exceeds the 500-word limit. Current word count is ${
          props.value.split(/\s+/).length
        }.`,
    },
  },
  reply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Letter",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

letterSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

const Letter = mongoose.model("Letter", letterSchema);

module.exports = Letter;
