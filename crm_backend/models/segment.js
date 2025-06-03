const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const segmentSchema = new mongoose.Schema(
  {
    segmentName: String,
    createdBy: { type: String, default: "sayjan7777@gmail.com" },
    conditions: [
      {
        field: String,
        operator: String,
        value: Schema.Types.Mixed, // Boolean, String, Number, etc.
      },
    ],
    previewCount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Segments", segmentSchema);
