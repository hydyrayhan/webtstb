const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const fs = require("fs")
require("dotenv").config({path:"./config/config.env"});
// const host = process.env.HOST;
const host = 'http://192.168.1.108:5000'
const app = express();
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

var follow;
app.get('/',async function(req,res){
 var sl = req.query.sl;
 var mainPage;
  try{
    mainPage = await axios.get(`${host}/`);
  }catch(error){
    console.log(error)
  }
  console.log(mainPage.data);
  follow = mainPage.data.statictika;
  mainPage = mainPage.data;
  languageData = mainPage.data
  
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

  var location = [];
  location[0] = mainPage.location.place.ashgabat;
  location[1] = mainPage.location.place.ahal;
  location[2] = mainPage.location.place.balkan;
  location[3] = mainPage.location.place.mary;
  location[4] = mainPage.location.place.dashoguz;
  location[5] = mainPage.location.place.lebap;
  location[6] = ['Balkan','Mary','Daşoguz','Lebap'];
  location[7] = ['Балкан','Мары','Дашогуз','Лебап'];
  location[8] = ['Balkan','Mary','Dashoguz','Lebap'];
  res.render('main',{list:mainPage,loop,loop1,host,seeAll,seeAllBolum,sl,location,follow})
})


app.get("/pressCenter",async function(req,res){
  var sl = req.query.sl;
  
  var data;
  try{
    data = await axios.get(`${host}/news`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/pressCenter.ejs",{list:data.data,host,sl,teg:'',follow});
})


app.get('/pressCenterNews',async function(req,res){
  var tab = req.query.tab;
  var page = req.query.page;
  var limit = req.query.limit;
  var tag = req.query.tag;
  var data;
  
  if(tab == 1){
    try{
      data = await axios.get(`${host}/news/loadMore?page=${page}&limit=${limit}&tag=${tag}`);
    }catch(error){
      console.log(error)
    }
  }else if(tab ==2){
    try{
      data = await axios.get(`${host}/events/loadMore?page=${page}&limit=${limit}&tag=${tag}`);
    }catch(error){
      console.log(error)
    }
  }

  // console.log(data.data);
  for(var i = 0; i<data.data.length; i++){
    if(tab == 1){
      data.data[i].tab = 'news';
    }else if(tab == 2){
      data.data[i].tab = 'events';
    }
  }


  res.json(data.data)
})

app.get('/pressCenter/:teg', async function(req,res){
  var teg = req.params.teg;
  try{
    data = await axios.get(`${host}/news/tags?tag=${teg}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data,'tagli ');

  res.render("pages/pressCenter.ejs",{list:data.data,host,sl:1,teg,follow});
})

let dataKarhana;
app.get("/karhana/:id",async function(req,res){
  var data;
  var pudak = req.query.pudak
  var id = req.params.id;
  try{
    data = await axios.get(`${host}/industry/front?id=${req.query.id}&index=${pudak-1}`);
  }catch(error){
    console.log(error)
  }

  console.log(data.data);

  console.log(id);
  res.render(`pages/karhana`,{data:data.data,id,pudak,host,follow});
})

app.get("/agzalar/:id",async function(req,res){
  var datas;
  try{
    datas = await axios.get(`${host}/members`);
  }catch(error){
    console.log(error)
  }
  

  let m=[]
  var data = [[],[],[],[],[],[]];
  for(var i = 0; i<datas.data.length; i++){
    if(datas.data[i].welayat == "Ashgabat"){
      data[0].push(datas.data[i]);
    }else if(datas.data[i].welayat == 'Ahal'){
      data[1].push(datas.data[i]);
    
    }else if(datas.data[i].welayat == 'Balkan'){
      data[2].push(datas.data[i]);
    }else if(datas.data[i].welayat == 'Mary'){
      data[3].push(datas.data[i]);
    }
    else if(datas.data[i].welayat == 'Dashoguz'){
      data[4].push(datas.data[i]);
    }
    else if(datas.data[i].welayat == 'Lebap'){
      data[5].push(datas.data[i]);
    }
  }
  var id = req.params.id;
  var idd;
  var place = 0;
  if (id<0){
    place = -1;
  }else{
    for(var i = 0; i<data.length; i++){
      for(var j = 0; j<data[i].length; j++){
        if(data[i][j].id == Number(id)){
          switch(data[i][j].welayat){
            case("Ashgabat"):
              place = 0;
              idd = j;
              break;
            case("Ahal"):
              place = 1;
              idd = j
              break;
            case("Balkan"):
              place = 2;
              idd = j
              break;
            case("Mary"):
              place = 3;
              idd = j
              break;
            case("Dashoguz"):
              place = 4;
              idd = j
              break;
            case("Lebap"):
              place = 5;
              idd = j
              break;
          }
        }
      }
    }
  }
  

  res.render("pages/agzalar",{data,place,idd,host,follow})
})



// Rysgal Gazeti
app.get("/gazet",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/newspapers/front`);
  }catch(error){
    console.log(error)
  }
  var page = req.query.page;
  console.log(data.data);
  res.render("pages/gazet",{data:data.data,page,host,follow}) 
})
// sppt
app.get("/sppt",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/menu/getAboutUs`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/sppt",{host,data:data.data,follow}) 
})

// Membership
app.get("/membership",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/menu/getMembership`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/membership",{host,data:data.data,follow})
})

// online Business
app.get("/onlineBussiness/:welayat",async function(req,res){
  var welayat = req.params.welayat;
  
  var data;
  try{
    data = await axios.get(`${host}/commerce?welayat=${welayat}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/business",{host,data:data.data,welayat,follow});
})

// businessPlan
app.get("/businessPlans",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/menu/getAllBussiness`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/plans",{host,data:data.data.bussiness,follow})
})

// licenses
app.get("/licenses",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/menu/getLicenseHeader`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/lisense",{host,data:data.data,follow});
})

//licensesMorePage
app.get("/licenses/:id",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/menu/getOneLicense?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/lisenseMore",{host,data:data.data,follow})
})

// konsultasiya
app.get("/consultation",async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/menu/getConsultation`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/konsultasiya",{host,data:data.data,follow});
})

// news
app.get('/news/:id',async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/news/getOneFront?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/news",{host,data:data.data,file:'news',follow});
})


// events
app.get('/events/:id',async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/events/getOneFront?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/news",{host,data:data.data,file:'events',follow});
})

//constructor
app.get('/constructor/:id', async function(req,res){
  var data;
  try{
    data = await axios.get(`${host}/constructor/subcategory/getOne?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  var page = data.data.page;
  console.log(data.data);
  if(page == '1'){
    res.render("templates/template1",{host,data:data.data,follow});
  }else if(page == '2'){
    res.render("templates/template2",{host,data:data.data,follow});
  }else if(page == '3'){
    res.render("templates/template3",{host,data:data.data,follow});
  }else if(page == '4'){
    res.render("templates/template4",{host,data:data.data,follow});
  }else if(page == '5'){
    res.render("templates/template6",{host,data:data.data,follow});
  }else if(page == '6'){
    res.render("templates/template7",{host,data:data.data,follow});
  }else if(page == '7'){
    res.render("templates/template8",{host,data:data.data,follow});
  }
})















// admin ==========================================================================================

app.get("/admin",function(req,res){
  res.render("pages/login",{host,follow})
})

app.post("/login",async function(req,res){
  
  var name = req.body.login;
  var pass = req.body.password;
  console.log(name,pass,269)
  var data;
  try{
    data = await axios({
      method: 'post',
      url: `${host}/login`,
      data: {name,pass}
    });
  }catch(error){
    console.log(error)
  }

  console.log(data.data);
  if(data.data.status == 200){
    res.redirect("admin/habarlar");
  }else{
    res.redirect("admin",follow);
  }
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
      data = await axios.get(`${host}/newspapers`);
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
  }else if(page == "parol"){
    res.render('admin/parol',{name:"Parol çalyşmak",host});
  }else if(page == "statistika"){
    try{
      data = await axios.get(`${host}/menu/getStatistika`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/statistika',{name:"Statistika",host,data:data.data});
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
    console.log(data.data);
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







// shablonlar

app.get('/template/:san',function(req,res){
  var san = req.params.san;
  if(san == 1){
    res.render("templates/template1",{host});
  }else if(san == 2){
    res.render("templates/template2",{host});
  }else if(san == 3){
    res.render("templates/template3",{host});
  }else if(san == 4){
    res.render("templates/template4",{host})
  }else if(san == 5){
    res.render("templates/template6",{host})
  }else if(san == 6){
    res.render("templates/template7",{host});
  }else if(san == 7){
    res.render("templates/template8",{host});
  }
})




//Server Start
app.listen("3001",function(){
  console.log('3001 server is working');
})
