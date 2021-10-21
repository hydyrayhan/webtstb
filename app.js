const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const fs = require("fs")
require("dotenv").config({path:"./config/config.env"});
const host = process.env.HOST;
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");

app.use(express.static("public"))
app.use('/css',express.static(__dirname+"public/style"));
app.use('/font',express.static(__dirname+"public/style"));
app.use('/js',express.static(__dirname+"public/scripts"));
app.use('/img',express.static(__dirname+"public/pictures"));

const { render } = require("ejs");
const { DefaultDeserializer } = require("v8");




let locations;
let languageData = '';
app.get('/',async function(req,res){
  // backend-den maglumat chekyar;
  // let data;
  // try{
  //   data = await axios.get(`http://10.192.168.43:5000/`);
  // }catch(error){
  //   console.log(error)
  // }
  // console.log(data.data);

 

  var mainPage = fs.readFileSync("./jsons/mainPage.json")
  mainPage = JSON.parse(mainPage);
  languageData = mainPage
  var loop = 0;
  var seeAll = false;
  if(mainPage.brands.length<9){
    loop = mainPage.brands.length;
  }else{
    loop = 9;
    seeAll = true;
  }

  var loop1 = 0;
  var seeAllBolum = false;
  if(mainPage.karhanalar.length<12){
    loop1 = mainPage.karhanalar.length;
  }else{
    loop1 = 12;
    seeAllBolum = true; 
  }

  res.render('main',{list:mainPage,loop,loop1,host,seeAll,seeAllBolum})
})


app.get("/pressCenter",async function(req,res){
  let data = fs.readFileSync("./jsons/pressCenter.json");
  data = JSON.parse(data);


//   let data3;
//   try{
//     data3 = await axios.get(`http://10.192.168.43:5000/pressCenter?page=${req.query.page}`);
//   }catch(error){
//     console.log(error)
//   }
//   console.log(data3,"jfldj")

    res.render("pages/pressCenter.ejs",{list:data,host});
  
})

var data1;
var data2;
var dataNews;

app.get('/pressCenterNews',function(req,res){
  if(req.query.tab == 1){
    if(data1 == undefined ){
      data1 = fs.readFileSync("./jsons/pressCenter.json");
      dataNews = data1;
    }else{
      dataNews = data1;
    }
  }else{
    if(data2 == undefined){
      data2 = fs.readFileSync("./jsons/pressCenter2.json");
      dataNews = data2;
    }else{
      dataNews = data2;
    }
  }
  dataNews = JSON.parse(dataNews);
  dataNews = dataNews.list;

  var senData = [];
  var page = req.query.page;
  for(var i = (page-1)*9; i<page*9; i++){
    senData.push(dataNews[i])
  }
  
  res.json(senData)
})


app.get("/karhana/:id",function(req,res){
  var data = fs.readFileSync("./jsons/karhana.json");
  data = JSON.parse(data);
  var id = req.params.id
  var pudak = req.query.pudak
  res.render(`pages/karhana`,{data,id,pudak});
})

app.get("/agzalar/:id",function(req,res){ 
  var data = fs.readFileSync("./jsons/agzalar.json");
  data = JSON.parse(data);
  

  var id = req.params.id;
  var place = 0;
  if (id<0){
    place = -1;
  }else{
    for(var i = 0; i<data.length; i++){
      for(var j = 0; j<data[i].length; j++){
        if(data[i][j].id == Number(id)){
          switch(data[i][j].place){
            case("Asgabat"):
              place = 0;
              break;
            case("Ahal"):
              place = 1;
              break;
            case("Dashoguz"):
              place = 2;
              break;
            case("Balkan"):
              place = 3;
              break;
            case("Lebap"):
              place = 4;
              break;
            case("Mary"):
              place = 5;
              break;
          }
        }
      }
    }
  }
  
  res.render("pages/agzalar",{data,place})
})



// sppt
app.get("/sppt",function(req,res){
  res.render("pages/sppt",{}) 
})

// Membership
app.get("/membership",function(req,res){
  res.render("pages/membership",{})
})

// online Business
app.get("/onlineBusiness",function(req,res){
  res.render("pages/business",{})
})

// businessPlan
app.get("/businessPlans",function(req,res){
  res.render("pages/plans",{})
})

// licenses
app.get("/licenses",function(req,res){
  res.render("pages/lisense");
})

// konsultasiya
app.get("/consultation",function(req,res){
  res.render("pages/konsultasiya");
})


// admin

app.get("/admin",function(req,res){
  var data = fs.readFileSync("./jsons/adminHabarlar.json");
  data = JSON.parse(data);
  var th = ["Ady","Täzelikler topary","Çap edilen senesi"]

  res.render("admin/habarlar",{data,th});
})

app.get("/admin/:page",function(req,res){
  var page = req.params.page;
  var data;
  if(page == "habarlar"){
    data = fs.readFileSync("./jsons/adminHabarlar.json");
    data = JSON.parse(data);
    res.render("admin/habarlar",{data,name:"Habarlar"});
  }else if(page == "bildirishler"){
    data = fs.readFileSync("./jsons/adminBildirishler.json");
    data = JSON.parse(data);
    res.render("admin/bildirishler",{data,name:"Bildirişler"});
  }else if(page = "rysgal"){
    data = fs.readFileSync("./jsons/adminRysgal.json");
    data = JSON.parse(data);
    res.render("admin/gazetler",{data,name:"Gazetler"})
  }
})

app.get("/admin/:page/add",function(req,res){
  var page = req.params.page;
  if(page == 'Habarlar'){

    res.render("admin/toAdd/addHabarlar",{name : page+" goşmak"});
  }
})

app.post("/addHabar",function(req,res){
  var date = req.body.date;
  var pdf = req.body.pdf;
  var img = req.body.image;
  console.log(req.body)
  data = fs.readFileSync("./jsons/adminHabarlar.json");
  data = JSON.parse(data);
  res.render("admin/habarlar",{data,name:"Habarlar"})
})



// shablonlar

app.get("/template1",function(req,res){
  
})



// example

app.get("/text",function(req,res){

  res.render("textEditor");
})

//Server Start
app.listen("3000",function(){
  console.log('3000 server is working');
})