const express = require("express")
const path = require("path")
const app = express()

app.use(express.static(path.join(__dirname)));
const products =[
    {id:1, name:"panda",category: "category 1",price: 200,image: "d.jpeg.jpeg"},
    {id:2, name:"panda",category: "category 2",price: 300,image: "d.jpeg.jpeg"},
    {id:3, name:"panda",category: "category 3",price: 400,image: "d.jpeg.jpeg"},
];

app.get("/api/products",(req,res)=>{
    res.json(products);
})

app.listen(3000,()=>{
    console.log("server is running on http://localhost:3000")
});