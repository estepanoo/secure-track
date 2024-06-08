const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const LuggageSchema = new Schema({
    luggage_tag_number: { 
        type: String, 
        required: true, 
        unique: true 
    },
    luggage_custom_name: { 
        type: String, 
        default: null 
    },
    latitude: { 
        type: Number, 
        required: true, 
        default: 14.5213 
    },
    longitude: { 
        type: Number, 
        required: true, 
        default: 121.0137 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['In Range', 'Out of Range', 'At Destination', 'Lost'], 
        default: 'In Range' 
    },
    user_id: { 
        type: ObjectId, 
        ref: 'User', 
        required: true 
    },
    stationary_since: { 
        type: Date, 
        default: Date.now 
    },
    destination: { 
        type: String, 
        required: true
    },
    updatedAt: {  
        type: Date,
        default: Date.now,
        required: true // 
    }
}, {
    collection: 'luggage',
    timestamps: true 
});


LuggageSchema.index({ luggage_tag_number: 1 });
LuggageSchema.index({ user_id: 1 });

module.exports = mongoose.model('Luggage', LuggageSchema);
