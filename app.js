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

const fileUpload = require("express-fileupload");
app.use(fileUpload())





let languageData = '';
app.get('/',async function(req,res){
  // backend-den maglumat chekyar;
  // let data;
  // try{
  //   data = await axios.get(`${host}/`);
  // }catch(error){
  //   console.log(error)
  // }
  // console.log(data.data);
  // var mainPage = data.data;

 var sl = req.query.sl;

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

  res.render('main',{list:mainPage,loop,loop1,host,seeAll,seeAllBolum,sl})
})


app.get("/pressCenter",async function(req,res){
  var sl = req.query.sl;
  let data = fs.readFileSync("./jsons/pressCenter.json");
  data = JSON.parse(data);


//   let data3;
//   try{
//     data3 = await axios.get(`${host}/pressCenter?page=${req.query.page}`);
//   }catch(error){
//     console.log(error)
//   }
//   console.log(data3,"jfldj")

    res.render("pages/pressCenter.ejs",{list:data,host,sl});
})

app.get("/login",function(req,res){
  res.render("pages/login")
})

app.post("/login",function(req,res){
  data = fs.readFileSync("./jsons/adminHabarlar.json");
  data = JSON.parse(data);
  res.render("admin/habarlar",{data,name:"Habarlar"});
  // res.render("admin/habarlar",{name:"Habarlar"})
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


let dataKarhana;
app.get("/karhana/:id",async function(req,res){
 // backend-den maglumat chekyar;

//  if(dataKarhana == undefined){
//    let data;
//    try{
//      data = await axios.get(`http://10.192.168.43:5000/industry`);
//    }catch(error){
//      console.log(error)
//    }
//    dataKarhana = data.data;
//  }

//  var data = dataKarhana;

  var data = fs.readFileSync("./jsons/karhana.json");
  data = JSON.parse(data);
  var id = req.params.id
  var pudak = req.query.pudak
  res.render(`pages/karhana`,{data,id,pudak,host});
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



// Rysgal Gazeti
app.get("/gazet",function(req,res){

  var page = req.query.page;
  res.render("pages/gazet",{page}) 
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
  res.render("pages/lisense",{id:1});
})

//licensesMorePage
app.get("/licenses/:id",function(req,res){
  res.render("pages/lisenseMore")
})

// konsultasiya
app.get("/consultation",function(req,res){
  res.render("pages/konsultasiya");
})


// admin

app.get("/admin",function(req,res){
  var data = fs.readFileSync("./jsons/adminHabarlar.json");
  data = JSON.parse(data);

  res.render("admin/habarlar",{data});
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
  }else if(page == "rysgal"){
    data = fs.readFileSync("./jsons/adminRysgal.json");
    data = JSON.parse(data);
    res.render("admin/gazetler",{data,name:"Gazetler"})
  }else if(page == "tstb"){
    res.render("admin/tstb",{name:"TSTB - biz barada"});
  }
})

app.get("/admin/:page/add",function(req,res){
  var page = req.params.page;
  if(page == 'Habarlar'){
    res.render("admin/toAdd/addHabarlar",{name : page+" goşmak"});
  }else if(page == "Bildirişler"){
    res.render("admin/toAdd/addBildirishler",{name:"Bildiriş goşmak"});
  }
})

app.post("/admin/:page/add",function(req,res){
  var date = req.body.date;
  var pdf = req.body.pdf;
  var img = req.body.image;
  console.log(req.body);
  data = fs.readFileSync("./jsons/adminHabarlar.json");
  data = JSON.parse(data);
  res.render("admin/habarlar",{data,name:"Habarlar"})
})
app.post("/suratBaryarmy",function(req,res){
  var a = req.files
})
app.post("/suratBaryarmy2",function(req,res){
  var a = req.files
})



// shablonlar

app.get('/template/:san',function(req,res){
  var san = req.params.san;
  if(san == 1){
    res.render("templates/template1");
  }else if(san == 2){
    res.render("templates/template2");
  }else if(san == 3){
    res.render("templates/template3");
  }else if(san == 4){
    res.render("templates/template4")
  }else if(san == 5){
    res.render("templates/template6")
  }else if(san == 6){
    res.render("templates/template7");
  }else if(san == 7){
    res.render("templates/template8")
  }
})



// example

app.get("/text",function(req,res){

  res.render("textEditor");
})

//Server Start
app.listen("3000",function(){
  console.log('3000 server is working');
})