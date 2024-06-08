const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TamperDetectionLogSchema = new Schema({
    luggage_tag_number: { type: String, ref: 'Luggage', required: true },
    tamper_time: { type: Date, default: Date.now },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, {
    collection: 'tamper_detection_logs'
});

module.exports = mongoose.model('TamperDetectionLog', TamperDetectionLogSchema);
