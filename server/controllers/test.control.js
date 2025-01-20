const Test = require('../models/test');
const User = require('../models/user');
const shortid = require('shortid');


const createTest = (req, res) => {

    const { email, test_name, test_link_by_user, start_time, end_time, no_of_candidates_appear, total_threshold_warnings } = req.body;

    if (!email || !test_name || !test_link_by_user || !start_time || !end_time || !no_of_candidates_appear) {
        console.error("Missing fields:", { email, test_name, test_link_by_user, start_time, end_time, no_of_candidates_appear });
        return res.status(400).json({ msg: "Missing required fields" });
    }

    let startTime, endTime;

    try {
        startTime = new Date(start_time);
        endTime = new Date(end_time);
        
        if (isNaN(startTime) || isNaN(endTime)) {
            throw new Error('Invalid date format');
        }
    } catch (err) {
        console.error("Invalid date format:", err);
        return res.status(400).json({ msg: "Invalid date format", error: err.message });
    }

    if (!req.user || !req.user.id) {
        console.error("User not authenticated or missing user ID");
        return res.status(401).json({ msg: "Unauthorized access" });
    }

    try {
        const test = new Test({
            userId: req.user.id, 
            email: email,
            test_name: test_name,
            test_link_by_user: test_link_by_user,
            test_code: shortid.generate() + "-" + shortid.generate(),
            start_time: startTime,  
            end_time: endTime,      
            no_of_candidates_appear: no_of_candidates_appear,
            total_threshold_warnings: total_threshold_warnings || 3, 
        });

        test.save((error, data) => {
            if (error) {
                console.error("Error saving test:", error); 
                return res.status(500).json({ msg: "Something went wrong while creating new test", error });
            }
            if (data) {
                return res.status(201).json({ msg: "Successfully created new Test on platform", data });
            }
        });
    } catch (err) {
        console.error("Unexpected Error:", err); 
        return res.status(500).json({ msg: "Server error", error: err });
    }
};



const userCreatedTests = (req, res) => {
    const userId = req.query.userId;  

    if (userId) {
       
        Test.find({ userId: userId })
            .exec((error, _allTests) => {
                if (error) return res.status(400).json({ msg: "Something went wrong while fetching user tests", error });
                if (_allTests) return res.status(200).json({ _allTests });
            });
    } else {
        return res.status(400).json({
            msg: {
                one: "Check user ID, something wrong with it",
                two: "Can't pass empty userId"
            }
        });
    }
};


const testRegister = async (req, res) => {
    const { test_code } = req.params;
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            test_code: test_code
        });
        res.status(200).json({ msg: "Now you are register" })
    }
}

const testAdminData = (req, res) => {
    const { test_code } = req.params;
    if (test_code) {
        User.find({ test_code: test_code })
            .exec((error, candidates) => {
                if (error) return res.status(400).json({ msg: "Something went wrong while fetching candidates-status" });
                if (candidates) return res.status(200).json({ candidates })
            })
    }
}

const increasePersonDetected = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            $inc: { person_detected: 1 }
        })
        res.status(200).json({ msg: "warning of person detected" });
    }
}

const increaseVoiceDetected = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            $inc: { voice_detected: 1 }
        })
        res.status(200).json({ msg: "warning of voice detected" });
    }
}

const increaseFaceCovering = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            $inc: { face_covered: 1 }
        })
        res.status(200).json({ msg: "warning for face covering" });
    }
}

const totalWarnings = (req, res) => {
    const userId = req.user.id;
    if (userId) {
        User.findOne({ _id: userId })
            .exec((error, data) => {
                if (data) {
                    let total_warnings = data.person_detected + data.voice_detected + data.face_covered;
                    return res.status(200).json({ totalWarnings: total_warnings })
                }
            })
    } else {
        return res.status(200).json({ msg: "check user-id" });
    }
}

const terminateExam = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            status: "block"
        });
      
        res.status(200).json({ msg: "candidate has been blocked" })
    }
}

const allowInExam = async (req, res) => {
    const userId = req.user.id;
    if (userId) {
        const updateData = await User.findOneAndUpdate({ _id: userId }, {
            status: "safe"
        });
        res.status(200).json({ msg: "candidate is now allowed to give exam" })
    }
}

module.exports = {
    createTest,
    userCreatedTests,
    testRegister,
    testAdminData,
    increasePersonDetected,
    increaseVoiceDetected,
    increaseFaceCovering,
    increasePersonDetected,
    increaseVoiceDetected,
    increaseFaceCovering,
    totalWarnings,
    terminateExam,
    allowInExam
}