const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")

const app = express();
dotenv.config();

const port = process.env.PORT || 5500;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD; 
 mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.je2sm.mongodb.net/registrationFormDB`
);
 

// registration schema 
const registrationSchema = new mongoose.Schema({
    name : String, 
    email : String, 
    password : String
});

// model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({extended: true }));  
app.use(bodyParser.json()); 
 
 app.get("/", (req, res) => {
 res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register" , async (req, res) => {
try {
    const {name, email, password } = req.body;
    const existingUser = await Registration.findOne({ email: email }); 

// check for existing user
    if (!existingUser) {
        const registrationData = new Registration({
            name, 
            email, 
            password,
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{
        alert("User already exist"); 
       res.redirect("/error");
       }
    }
    catch(error){
        console.log(error);
        res.redirect("error");
    }
});

app.get("/success", (req, res)=> {
    res.sendFile(__dirname +"/pages/success.html");
})

app.get("/error", (req, res)=> {
    res.sendFile(__dirname +"/pages/error.html");
})
    
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);

})