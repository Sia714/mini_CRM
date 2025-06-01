const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const segmentSchema = new mongoose.Schema(
  {
    segmentName: String,
    createdBy: String,
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
