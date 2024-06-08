const express = require('express');
const Luggage = require('../models/Luggage');
const User = require('../models/User')
const FallDetectionLog = require('../models/FallDetectionLog');
const TamperDetectionLog = require('../models/TamperDetectionLog');
const TempLog = require('../models/TempLog')

const router = express.Router();



router.get('/luggage', async(req, res) => {
  try {
    const luggage = await Luggage.find();
    if(!luggage){
      return res.status(404).json({status: false, message: "Luggage not found"});
    } 
    res.json(luggage)
  } catch (error) {
    console.log('Error fetching luggage data:', error);
    res.status(500).send("Server Error");
  }
})


router.get('/fall-logs1', async (req, res) => {
  try {
    const luggageList = await Luggage.find({});
    if (luggageList.length === 0) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    const luggageTagNumbers = luggageList.map(luggage => luggage.luggage_tag_number);
    const fallLogs = await FallDetectionLog.find({ luggage_tag_number: { $in: luggageTagNumbers } });

    if (fallLogs.length === 0) {
      return res.status(404).json({ status: false, message: "No fall detection logs found" });
    }

    res.json(fallLogs);
  } catch (error) {
    console.error('Error fetching fall detection logs:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});



router.get('/tamper-logs', async (req, res) => {
  try {
    const luggageList = await Luggage.find({});
    if (luggageList.length === 0) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }
    const luggageTagNumbers = luggageList.map(luggage => luggage.luggage_tag_number);
    const tamperLogs = await TamperDetectionLog.find({ luggage_tag_number: { $in: luggageTagNumbers } });

    if (tamperLogs.length === 0) {
      return res.status(404).json({ status: false, message: "No fall detection logs found" });
    }

    res.json(tamperLogs)
  } catch (error) {
    console.error('Error fetching tamper detection logs:', error);
    res.status(500).send('Server error');
  }
});

router.get('/temp-logs', async(req, res) => {
  try {
    const luggageList = await Luggage.find({});
    if (luggageList.length === 0) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }
    const luggageTagNumbers = luggageList.map(luggage => luggage.luggage_tag_number);
    const tempLogs = await TempLog.find({ luggage_tag_number: { $in: luggageTagNumbers } });
    
    res.json(tempLogs);
  } catch (error) {
    console.error('Error fetching temperature logs:', error);
    res.status(500).send('Server error');
  }
});




router.post('/addluggage', async (req, res) => {
  const { luggage_custom_name, luggage_tag_number, destination, user_id } = req.body;

  if (!luggage_custom_name || !luggage_tag_number || !destination || !user_id) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const newLuggage = new Luggage({
      luggage_custom_name,
      luggage_tag_number,
      destination,
      user_id
    });

    const savedLuggage = await newLuggage.save();
    res.status(201).json(savedLuggage);
  } catch (error) {
    console.error('Error adding new luggage:', error);
    res.status(500).send('Server error');
  }
});

router.put('/updateluggage/:id', async (req, res) => {
 
  if (!luggage_custom_name || !luggage_tag_number || !destination || !status || !user_id) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  try {
    const updatedLuggage = await Luggage.findByIdAndUpdate(luggageId, {
      luggage_custom_name,
      luggage_tag_number,
      destination,
      status,
      user_id
    }, { new: true });

    if (!updatedLuggage) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    res.json(updatedLuggage);
  } catch (error) {
    console.error('Error updating luggage:', error);
    res.status(500).send('Server error');
  }
});


router.delete('/deleteluggage/:id', async (req, res) => {
  const luggageId = req.params.id;

  try {
    const deletedLuggage = await Luggage.findByIdAndDelete(luggageId);

    if (!deletedLuggage) {
      return res.status(404).json({ status: false, message: "Luggage not found" });
    }

    res.json({ status: true, message: "Luggage deleted successfully" });
  } catch (error) {
    console.error('Error deleting luggage:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
