const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const fs = require("fs")
require("dotenv").config({path:"./config/config.env"});
const host = process.env.HOST;
// const host = 'http://192.168.43.233:5000'
const app = express();
// app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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

    res.render("pages/pressCenter.ejs",{list:data,host,sl});
})

app.get("/login",function(req,res){
  res.render("pages/login")
})

app.post("/login",function(req,res){
  data = fs.readFileSync("./jsons/adminHabarlar.json");
  data = JSON.parse(data);
  res.render("admin/habarlar",{data,name:"Habarlar"});
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

















// admin ==========================================================================================

app.get("/admin",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/news/getAll`);
  }catch(error){
    console.log(error)
  }
  res.render("admin/habarlar",{data:data.data,name:"Habarlar",host:host});
})
















// Get functions


let banner
let katigoriya
app.get("/admin/:page",async function(req,res){
  var page = req.params.page;
  var data;
  if(page == "habarlar"){
    try{
      data = await axios.get(`${host}/news/getAll`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/habarlar",{data:data.data,name:"Habarlar",host:host});
  }else if(page == "bildirishler"){
    try{
      data = await axios.get(`${host}/events/getAll`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/bildirishler",{data:data.data,name:"Bildirişler",host});
  }else if(page == "rysgal"){
    try{
      data = await axios.get(`${host}/newspapers/`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/gazetler",{data:data.data, name:"Gazetler", host});
  }else if(page == "tstb"){
    try{
      data = await axios.get(`${host}/menu/getAboutUs`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/tstb",{data:data.data,name:"TSTB - biz barada",host});
  }else if(page == "pudaklar"){
    try{
      data = await axios.get(`${host}/industry`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/pudaklar",{data:data.data,name:"Pudaklar"});
  }else if(page == "agzalyk"){
    try{
      data = await axios.get(`${host}/menu/getMembership`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/agzalyk",{data:data.data,name:"Agzalyk",host});
  }else if(page == "internetSowda"){
    try{
      data = await axios.get(`${host}/commerce/getAll`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/internetSowda",{data:data.data,name:"Internet Söwda",host});
  }else if(page == "plans"){
    try{
      data = await axios.get(`${host}/menu/getAllBussiness`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/plans",{data:data.data.bussiness,name:"Iş meýilnamasy",host})
  }else if(page == "ygtyyarnama"){
    try{
      data = await axios.get(`${host}/menu/getAllLicense`);
    }catch(e){
      console.log(e)
    }
    console.log(data.data)
    res.render("admin/lisense",{data:data.data,name:"Ygtyýarnama",host})
  }else if(page == "maslahat"){
    try{
      data = await axios.get(`${host}/menu/getConsultation`);
    }catch(e){
      console.log(e)
    }
    console.log(data.data)
    res.render("admin/konsultasiya",{data:data.data,name:"Maslahat",host})
  }else if(page == "kompaniyalar"){
    try{
      data = await axios.get(`${host}/members/`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/kompaniyalar",{data:data.data, name:"TSTB agzalary", host});

  }else if(page == "partniyorlar"){
    try{
      data = await axios.get(`${host}/sponsor/getAll`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/partniyorlar",{data:data.data,name:"Partniýorlar"});
  }else if(page == "banner1"){
    try{
      data = await axios.get(`${host}/banners/getOne?id=1`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/banner1",{data:data.data.banner, name:"1-nji banner", host});
  }else if(page == "banner2"){
    try{
      data = await axios.get(`${host}/banners/getOne?id=2`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/banner2",{data:data.data.banner, name:"2-nji banner", host});
  }else if(page == "banner3"){
    try{
      data = await axios.get(`${host}/banners/getOne?id=3`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/banner3",{data:data.data.banner, name:"3-nji banner", host});
  }else if(page == "mail"){
    try{
      data = await axios.get(`${host}/mail/`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/mail",{data:data.data,name:"Mail subcribers"});
  }else if (page == "constructor"){
    try{
      data = await axios.get(`${host}/constructor/`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/constructor",{data:data.data,name:"Constructor kategoriýalar"});
  }else if(page == "karta"){
    try{
      data = await axios.get(`${host}/province/getProvince`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/karta",{data:data.data,name:"Karta",host});
  }
})


// page post
app.post("/admin/:page",function(req,res){
  var page = req.params.page;
  if(page == "subConstructor"){
    var nomer = req.body.shablon;
    console.log(req.body);
    banner=nomer
    if(nomer == 1){
      res.render("admin/toAdd/shablon/shablon1",{data:req.body,name:"Sub Constructor",id:constructorId,host});
    }else if(nomer == 2){
      res.render("admin/toAdd/shablon/shablon2",{data:req.body,name:"Sub Constructor",host,id:constructorId});
    }else if(nomer == 3){
      res.render("admin/toAdd/shablon/shablon3",{data:req.body,name:"Sub Constructor",host,id:constructorId});
    }else if(nomer == 4){
      res.render("admin/toAdd/shablon/shablon4",{data:req.body,name:"Sub Constructor",host,id:constructorId})
    }else if(nomer == 5){
      res.render("admin/toAdd/shablon/shablon5",{data:req.body,name:"Sub Constructor",host,id:constructorId})
    }else if(nomer == 6){
      res.render("admin/toAdd/shablon/shablon6",{data:req.body,name:"Sub Constructor",host,id:constructorId})
    }else if(nomer == 7){
      res.render("admin/toAdd/shablon/shablon7",{data:req.body,name:"Sub Constructor",host,id:constructorId})
    }
  }else if(page == "subConstructor2"){
    console.log("Shablondan Maglumat geldi"+constructorId);
    console.log(req.body);
    res.redirect(`/admin/subConstructor/${constructorId}`)
  }
})






// page add
app.get("/admin/:page/add",async function(req,res){
  var page = req.params.page;
  var data;
  if(page == 'Habarlar'){
    try{
      data = await axios.get(`${host}/news/tag`);
      res.render("admin/toAdd/addHabarlar",{tag:data.data,name : page+" goşmak",host});
    }catch(error){
      res.send(error);
    }
    
  }else if(page == "Bildirişler"){
    try{
      data = await axios.get(`${host}/events/tag`);
      res.render("admin/toAdd/addBildirishler",{tag:data.data,name : "Bildiriş goşmak",host});
    }catch(error){
      res.send(error);
    }

  }else if(page == "Gazetler"){
    res.render("admin/toAdd/addGazetler",{name:"Gazet goşmak",host})
  }else if(page == "Pudaklar"){
    res.render("admin/toAdd/addPudaklar",{name:"Pudak goşmak",host})
  }else if(page == "Kärhanalar"){
    res.render("admin/toAdd/addKarhanalar",{name:"Kärhana goşmak",host,id:pudakId})
  }else if(page == "Internet Söwda"){
    try{
      data = await axios.get(`${host}/commerce/getCategorySimple`);
      console.log(data.data);
      res.render("admin/toAdd/addInternetSowda",{tag:data.data,name:"Internet Söwda goşmak",host})
    }catch(error){
      res.send(error);
    }
  }else if(page == "Iş meýilnamasy"){
    res.render("admin/toAdd/addPlans",{name:"Iş meýilnamasyny goşmak",host})
  }else if(page == "Ygtyýarnama"){
    res.render("admin/toAdd/addLisense",{name:"Ygtyýarnama goşmak",host})
  }else if(page == "TSTB agzalary"){
    res.render('admin/toAdd/addKompaniyalar',{name:"TSTB agza goşmak",host});
  }else if(page == "Partniýorlar"){
    res.render("admin/toAdd/addPartniyorlar",{name:"Partniýor goşmak",host})
  }else if(page == "1-nji banner"){
    res.render("admin/toAdd/addBanner1",{name : "Banner 1-a goşmak",host});
  }else if(page == "2-nji banner"){
    res.render("admin/toAdd/addBanner2",{name:"2-nji bannere goşmak",host})
  }else if(page == "3-nji banner"){
    res.render("admin/toAdd/addBanner3",{name:"3-nji bannere goşmak",host})
  }else if(page == "Constructor kategoriýalar"){
    res.render("admin/toAdd/addConstructorKategori",{host,name:"Constructor kategoriýa goşmak"})
  }else if(page == "Sub constructorlar"){
    console.log(constructorId)
    res.render("admin/toAdd/addSubConstructor",{name:"Sub constructor goşmak"})
  }
})



// page edit
app.get("/admin/:page/edit/:id",async function(req,res){
  var page = req.params.page;
  var id = req.params.id;
  var data;
  if(page == "habarlar"){
    try{
      data = await axios.get(`${host}/news/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/toEdit/editHabarlar",{data:data.data[0],tags:data.data[1],name:"Habarlar üýtgetmek",host:host});
  }else if(page == 'bildirishler'){
    try{
      data = await axios.get(`${host}/events/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/toEdit/editBildirishler",{data:data.data[0],tags:data.data[1],name:"Bildiriş üýtgetmek",host:host});
  }else if(page == 'gazetlar'){
    try{
      data = await axios.get(`${host}/newspapers/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data);
    res.render("admin/toEdit/editGazetlar",{data:data.data,name:"Gazet üýtgetmek",host:host});
  }else if (page == 'banner1'){
    try{
      data = await axios.get(`${host}/banners/getOneBanner?id=1&index=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner1",{data:data.data,index:req.params.id,name:"1-nji banneri üýtgetmek",host:host});
  }else if (page == 'banner2'){
    try{
      data = await axios.get(`${host}/banners/getOneBanner?index=${id}&id=2`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner2",{data:data.data,index:req.params.id,name:"2-nji banneri üýtgetmek",host});
  }else if (page == 'banner3'){
    try{
      data = await axios.get(`${host}/banners/getOneBanner?index=${id}&id=3`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner3",{data:data.data,index:req.params.id,name:"3-nji banneri üýtgetmek",host});
  }else if(page == 'kompaniyalar'){
    try{
      data = await axios.get(`${host}/members/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editKompaniyalar",{data:data.data,id:req.params.id,name:"Kompaniýa üýtgetmek",host});
  }else if(page == 'internetSowda'){
    try{
      data = await axios.get(`${host}/commerce/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editInternetSowda",{data:data.data[0],tag:data.data[1],id:req.params.id,name:"Internet Söwdany üýtgetmek",host});
  }else if(page == 'ishMeyilnamasy'){
    try{
      data = await axios.get(`${host}/menu/getOneBussiness?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editPlans',{data:data.data,name:"Iş meýilnamasyny üýtgetmek",host});
  }else if(page == 'ygtyyarnama'){
    try{
      data = await axios.get(`${host}/menu/getOneLicense?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editLisense',{data:data.data,name:"Ygtyýarnama üýtgetmek",host});
  }else if(page == "pudaklar"){
    try{
      data = await axios.get(`${host}/industry/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/toEdit/editPudaklar",{data:data.data,host,name:"Pudaklar üýtgetmek"});
  }else if(page == "karhanalar"){
    try{
      data = await axios.get(`${host}/industry/subCategory?index=${id}&id=${pudakId}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/toEdit/editKarhanalar",{data:data.data,name:"Karhanalar üýtgetmek",host,index:id,id:pudakId});
  }else if(page == 'partniyorlar'){
    try{
      data = await axios.get(`${host}/sponsor/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editPartniyorlar',{data:data.data,host,name:'Partniýorlar üýtgetmek'})
  }else if(page == 'constructorKategori'){
    try{
      data = await axios.get(`${host}/constructor/getOneSimple?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editConstructorKategori',{data:data.data,host,name:'Constructor kategory üýtgetmek',id})
  }else if(page == 'subConstructor'){
    try{
      data = await axios.get(`${host}/constructor/subCategory/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    var sh = Number(data.data.page);
    var name = 'Constructor kategory üýtgetmek'
    if(sh == 1){
      res.render('admin/toEdit/shablon/shablon1',{data:data.data,host,name,id})
    }else if(sh == 2){
      res.render('admin/toEdit/shablon/shablon2',{data:data.data,host,name,id})
    }else if(sh == 3){
      res.render('admin/toEdit/shablon/shablon3',{name,data:data.data,host,id})
    }else if(sh == 4){
      res.render('admin/toEdit/shablon/shablon4',{name,data:data.data,host,id})
    }else if(sh == 5){
      res.render('admin/toEdit/shablon/shablon5',{name,data:data.data,host,id})
    }else if(sh == 6){
      res.render('admin/toEdit/shablon/shablon6',{name,data:data.data,host,id})
    }else if(sh == 7){
      res.render('admin/toEdit/shablon/shablon7',{name,data:data.data,host,id})
    }
  }
})



 


// page delete
app.get("/admin/:page/delete/:id",async function(req,res){
  var page = req.params.page;
  var id = req.params.id;
  if(page == 'habarlar'){
    try{
      await axios.delete(`${host}/news?id=${id}`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/habarlar")
  }else if(page == 'bildirishler'){
    try{
      await axios.delete(`${host}/events?id=${id}`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/bildirishler")
  }else if(page == 'gazetlar'){
    try{
      await axios.delete(`${host}/newspapers?id=${id}`);
    }catch(error){
      console.log(error)
    }
    
    res.redirect("/admin/rysgal");
  }else if(page == "banner1"){
    try{
      await axios.delete(`${host}/banners?index=${id}&id=1`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/banner1");
  }else if(page == "banner2"){
    try{
      await axios.delete(`${host}/banners?index=${id}&id=2`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/banner2");
  }else if(page == 'banner3'){
    try{
      await axios.delete(`${host}/banners?index=${id}&id=3`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/banner3");
  }else if(page == 'kompaniyalar'){
    try{
      await axios.delete(`${host}/members?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect("/admin/kompaniyalar");
  }else if(page == 'internetSowda'){
    try{
      await axios.delete(`${host}/commerce?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect("/admin/internetSowda");
  }else if(page == 'ishMeyilnamasy'){
    try{
      await axios.delete(`${host}/menu/deleteBussiness?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/plans');
  }else if(page == 'ygtyyarnama'){
    try{
      await axios.delete(`${host}/menu/deleteLicense?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/ygtyyarnama');
  }else if(page == 'partniyorlar'){
    try{
      await axios.delete(`${host}/sponsor?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/partniyorlar');
  }else if(page == 'pudaklar'){
    try{
      await axios.delete(`${host}/industry?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/pudaklar');
  }else if(page == "karhanalar"){
    try{
      await axios.delete(`${host}/industry/subCategory?index=${id}&id=${pudakId}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/karhanalar/'+pudakId);
  }else if(page == 'constructorKategori'){
    try{
      await axios.delete(`${host}/constructor?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/constructor')
  }else if(page == 'subConstructor'){
    try{
      await axios.delete(`${host}/constructor/subCategory?id=${id}`);
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/subConstructor/'+constructorId);
  }else if(page == 'mail'){
    try{
      await axios.delete(`${host}/mail?id=${id}`);
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/mail');
  }
})


// karhanalar
var pudakId;
app.get("/admin/karhanalar/:id",async function(req,res){
  pudakId = req.params.id
  var data;
  try{
    data = await axios.get(`${host}/industry/getOne?id=${pudakId}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data)
  res.render("admin/karhanalar",{data:data.data,name:`Kärhanalar`})
})


// sub Constructorlar ucin
var constructorId;
app.get("/admin/subConstructor/:id",async function(req,res){
  constructorId = req.params.id;
  var data;
  try{
    data = await axios.get(`${host}/constructor/getOne?id=${constructorId}`)
  }catch(e){
    console.log(e);
  }
  console.log(data.data);
  res.render("admin/subConstructor",{data:data.data.constructors,name:`Sub constructorlar`})
})





// //internet sowda kategori add
// app.post("/internetKategori",function(req,res){
//   res.redirect("/admin/Internet Söwda/add");
// })





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




//Server Start
app.listen("3000",function(){
  console.log('3000 server is working');
})