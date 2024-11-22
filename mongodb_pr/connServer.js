const express = require("express");
const app = express();
const mongoose = require("mongoose")

app.use(express.static("view"));
app.use(express.urlencoded({extended :true}));
app.use(express.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/view/index.html");
})

mongoose.connect("mongodb://localhost:27017/External_pr");

const con = mongoose.connection;
con.on("connected",()=>{
    console.log("connected to mongoDb");
})

const userschema = mongoose.Schema({
    userId: String,
    userName: String,
    age :Number,
    contact: String,
    role: String,
});

const usersModel = mongoose.model("users",userschema);

app.get("/api/users",(req,res)=>{
    usersModel.find().then((data)=>
    {
        res.json(data);
    });
});

app.post("/api/addUsers",async(req,res)=>{
    console.log("Request body:",req.body);

    const newUser = new usersModel({
        userId: req.body.userId,
        userName: req.body.userName,
        age : req.body.age,
        contact: req.body.contact,
        role: req.body.role,
    });
    try{
        await newUser.save();
        res.json({message : "user added successfully"});

    }catch(err){
        console.error(err);
        res.status(500).send(err);
    }
})


app.put("/api/editUsers/:userID",async(req,res)=>{
 
    const updatedUser ={
        userName: req.body.userName,
        age : req.body.age,
        contact: req.body.contact,
        role: req.body.role,
    }
    try{
        const user = await usersModel.findOneAndUpdate(
            {userId : req.params.userID},
            updatedUser,{new :true}
        );

      
        res.json({message : "user updated successfully"});

    }catch(err){
        console.error(err);
        res.status(500).send(err);
    }
})

app.delete("/api/deleteUser/:userID", async (req, res) => {
    try {
        await usersModel.findOneAndDelete({ userId: req.params.userID }); // Corrected key
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.listen(2002,()=>{
    console.log(`serevr is running on http://localhost:2002`);
})