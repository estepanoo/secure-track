const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FallDetectionLogSchema = new Schema({
    luggage_tag_number: { type: String, ref: 'Luggage', required: true },
    fall_time: { type: Date, default: Date.now },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, {
    collection: 'fall_detection_logs'
});

module.exports = mongoose.model('FallDetectionLog', FallDetectionLogSchema);
