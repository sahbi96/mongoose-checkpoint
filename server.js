const express = require("express")
const mongodb = require("mongodb")
const mongoose = require('mongoose');
const Person = require("./model/person");

const app = express()
const port = 5500;
//connect to mongodb atlas


const mongoURI = "mongodb+srv://sahbi96:mongo123@cluster0.i4cw2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
app.listen( 5500,(err)=>{
  err ? console.log("server is not running",err) : console.log("server is running on port 5500")
})
//create and save

app.get('/creating',(req,res)=>{
  const sahbi = new Person({
    name:"sahbi",
    age:25,
    favoriteFoods:['pizza','lasagne','tacos']
  })
//adding sahbi to mongodb atlas
sahbi.save((err,data)=>{
  (err)?console.log("error",err) : console.log("SAVED !",data)
})
})
//create instance of model

app.get('/create_many',(req,res)=>{
  Person.create([
    {
      name:"ahmed",
      age:19,
      favoriteFoods:['makloub','chapati','kafteji']
    },
    {
      name:"omar",
      age:26,
      favoriteFoods:['pizza','spaghetti','burrito']
    },
    {
      name:"mongi",
      age:22,
      favoriteFoods:['riz','salade cesar','poisson']
    },
 

  ])
 
  
})



//Search name
let name ="omar"
app.get('/search',(req,res)=>{
  Person.find({"name":name}).then((result)=>{
    res.send(result)
  })
  .catch((err)=>{console.log("error occured while searching",err)})

})

//Search findOne

app.get('/findOne',(req,res)=>{
  Person.findOne({"favoriteFoods":{$in : ["poisson","riz","salade cesar"]}})
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{console.log("error",err)})
})

//find by ID
var id = "60ae26b91cc4b72c9cd8c94a";
app.get('/findID',(req,res)=>{
  Person.findById(id, function (err, user) { 
    if (err){ 
        console.log(err); 
    } 
    else{ 
        console.log("Result : ", user); 
    } 
}); 
})

// Perform Classic Updates by Running Find, Edit, then Save

const personId = "60ae26b91cc4b72c9cd8c949"
app.get('/update',(req,res)=>{
  Person.findById(personId,(err,found)=>{
    if(err){
        console.log("error",err)
    } 
    else{
        found.favoriteFoods.push('cake');
        found.save()
        .then(response=>{console.log("SAVED !",found)})
        .catch(err=>console.log("error",err))
    }
      
   })

})
// Perform New Updates on a Document Using model.findOneAndUpdate()

const personName = "aziz"
app.get("/findOneAndUpdate",(req,res)=>{
  Person.findOneAndUpdate({"name":personName},{"age":20},{new:true},(err,personUpdated)=>{
      (err)?console.log("error ",err):console.log("person updated :",personUpdated)
  })
})
// Delete One Document Using model.findByIdAndRemove
const personId1="60ae26b91cc4b72c9cd8c949"
app.get('/findByIdAndRemove',(req,res)=>{
    Person.findByIdAndRemove(personId1,(err,deletedPerson)=>{
        (err)?console.log("error ",err):console.log("this person is deleted ",deletedPerson)
    })
})
//MongoDB and Mongoose - Delete Many Documents with model.remove()
app.get('/deleteMary',(req,res)=>{
  Person.remove({"name":"Mary"},(err,result)=>{
        (err)?console.log("error "):console.log("deleted ",result)
  })
})
//Chain Search Query Helpers to Narrow Search Results
app.get('/burrito',(req,res)=>{
  Person.find({"favoriteFoods":{$in:"burrito"}}).sort('name').limit(2).select('-age').exec((err,data)=>{
  (err)?console.log("error",err):console.log("people who like burrito",data)
  })
})