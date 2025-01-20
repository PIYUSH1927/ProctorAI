const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const Test = require("./models/test");
const { requireSignIn } = require("./middlewares");

const app = express();
app.use(cookieParser());


app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dburl =
  "mongodb+srv://padiapiyush12:newpassword@cluster0.thxdr.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = (dburl) => {
  return mongoose
    .connect(dburl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected");
    });
};

const testTakerSchema = new mongoose.Schema({
  testCode: {
    type: String,
    required: true,
    trim: true,
  },
  name: { type: String, required: true },
  registrationNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  warningCount: {
    type: Number,
    default: 0,
  },
});

testTakerSchema.index(
  { testCode: 1, registrationNumber: 1 },
  { unique: false }
);

const TestTaker = mongoose.model("test_taker", testTakerSchema);

app.post("/api/test-taker", async (req, res) => {
  try {
    const { testCode, registrationNumber, email, name } = req.body;

    if (!testCode || !registrationNumber || !email || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTestTaker = await TestTaker.findOne({
      testCode,
      registrationNumber,
    });

    if (existingTestTaker) {
      return res.status(200).json({
        message:
          "Test taker already exists for this test code and registration number",
      });
    }

    const newTestTaker = new TestTaker({
      testCode,
      registrationNumber,
      email,
      name,
    });

    await newTestTaker.save();

    res.status(201).json({ message: "Test taker data saved successfully" });
  } catch (error) {
    console.error("Error saving test taker data:", error);

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/api/test-takers", async (req, res) => {
  try {

    const testTakers = await TestTaker.find();

    res.status(200).json({
      message: "All test takers fetched successfully",
      data: testTakers,
    });
  } catch (error) {
    console.error("Error fetching test takers:", error);

  
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.get("/api/test-taker/:testCode/:registrationNumber", async (req, res) => {
  try {
    const { testCode, registrationNumber } = req.params;

    const testTaker = await TestTaker.findOne({ testCode, registrationNumber });

    if (!testTaker) {
      return res.status(404).json({ message: "Test taker not found" });
    }

    res.status(200).json(testTaker);
  } catch (error) {
    console.error("Error fetching test taker data:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});


app.put(
  "/api/test-taker/:testCode/:registrationNumber/warningCount",
  async (req, res) => {
    try {
      const { testCode, registrationNumber } = req.params;
      const { warningCount } = req.body; 


      const testTaker = await TestTaker.findOne({
        testCode,
        registrationNumber,
      });

      if (!testTaker) {
        return res.status(404).json({ message: "Test taker not found" });
      }

      testTaker.warningCount = warningCount;

      await testTaker.save();

      res.status(200).json(testTaker);
    } catch (error) {
      console.error("Error updating warningCount:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

app.get("/api/all-tests", (req, res) => {
  Test.find({}).exec((error, allTests) => {
    if (error)
      return res
        .status(400)
        .json({ msg: "Something went wrong while fetching tests", error });
    if (allTests.length > 0) {
      return res.status(200).json({ allTests });
    } else {
      return res.status(404).json({ msg: "No tests found" });
    }
  });
});

app.delete("/api/tests/:test_id", requireSignIn, async (req, res) => {
  const { test_id } = req.params;

  if (!test_id) {
    return res.status(400).json({ msg: "Test ID is required" });
  }

  try {
    const test = await Test.findOne({ _id: test_id, userId: req.user.id });

    if (!test) {
      return res
        .status(404)
        .json({ msg: "Test not found or not authorized to delete" });
    }

    await Test.deleteOne({ _id: test_id });

    return res.status(200).json({ msg: "Test deleted successfully" });
  } catch (err) {
    console.error("Error deleting test:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
});

app.use("/public", express.static(path.join(__dirname, "uploads")));

const userRoutes = require("./routes/user.routes");
const testRoutes = require("./routes/test.routes");
app.use("/api", userRoutes);
app.use("/api", testRoutes);

const start = async () => {
  try {
    await connectDB(dburl);
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
