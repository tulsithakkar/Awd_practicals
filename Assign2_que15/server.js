const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

mongoose.connect("mongodb://localhost:27017/23mca");

const con = mongoose.connection;
con.on("connected",()=>{
    console.log("connected to mongoDb");
})

const userSchema = mongoose.Schema({
    UserId : String,
    password: String,
    role: String
});

const studentSchema = mongoose.Schema({
    studID: String,
    studName: String,
    course: String,
    semester : String,
    status : String,
});

const User = mongoose.model("User",userSchema);
const Student = mongoose.model("Student",studentSchema);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
});

app.get("/api/Users",(req,res)=>{
    User.find().then((data)=>{
        res.json(data);
    })
    .catch((err)=>res.status(500).send(err));
})

app.get("/api/students",(req,res)=>{
    Student.find().then((data)=>{
        res.json(data);
    })
    .catch((err)=>res.status(500).send(err));
})

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    User.findOne({ UserId: username, password: password })
    .then(user => {
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }
        if (user.role === "student") {
            Student.findOne({ studID: user.UserId })
            .then(student => {
                if (student) {
                    res.json({
                        success: true,
                        role: user.role,
                        studentDetails: student
                    });
                } else {
                    res.status(404).json({ success: false, message: "Student details not found" });
                }
            })
            .catch(err => res.status(500).json({ success: false, message: "Error retrieving student details", error: err }));
        } else {
            res.json({ success: true, role: user.role });
        }
    })
    .catch(err => res.status(500).json({ success: false, message: "Error during login", error: err }));
});

app.post("/api/students", (req, res) => {
    const newStudent = new Student(req.body);
    newStudent.save()
        .then((data) => res.json(data))
        .catch((err) => res.status(500).send(err));
});


app.put('/api/students/:id', (req, res) => {
    const studentID = req.params.id;
    const updatedData = req.body;
    Student.findOneAndUpdate({ studID: studentID }, updatedData, { new: true })
    .then(updatedStudent => {
        if (!updatedStudent) {
            res.status(404).json({ success: false, message: "Student not found" });
        } else {
            res.json({ success: true, updatedStudent });
        }
    })
    .catch(err => res.status(500).send(err));
});


app.delete("/api/students/:id",(req,res)=>
    {
        Student.findOneAndDelete({studID: req.params.id})
        .then(()=>{
            res.send("deleted sucessfully");
        })
        .catch((err)=>res.status(500).send(err));
    });

app.listen(3002,()=>{
    console.log(`sever is running on http://localhost:3002/`);
});