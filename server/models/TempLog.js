const mongoose = require("mongoose");
const fs = require("fs");
const { timeStamp } = require("console");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TempLogSchema = new Schema(
  {
    luggage_tag_number: { type: String, ref: "Luggage", required: true },
    temperature: { type: Number },
    timeStamp: { type: Date, default: Date.now },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    collection: "temp_logs",
  }
);

module.exports = mongoose.model("TempLog", TempLogSchema);
