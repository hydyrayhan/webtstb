const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const fs = require("fs")
require("dotenv").config({path:"./config/config.env"});
const path = require('path')
const host = process.env.HOST;
const hostiso = process.env.HOSTISO;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");

app.use(express.static("public"))
app.use('/css',express.static(path.join(__dirname,"public","style")));
app.use('/font',express.static(path.join(__dirname,"public","style")));
app.use('/js',express.static(path.join(__dirname,"public","scripts")));
app.use('/img',express.static(path.join(__dirname,"public","pictures")));

const fileUpload = require("express-fileupload");
app.use(fileUpload())

const localHost = 'http://localhost:5000'

let languageData = '';
var follow;
app.get('/',async function(req,res){
 var sl = req.query.sl;
 var mainPage;


 //shu yerde axios backend den maglumat alyp bilenok 
  try{
    // mainPage = await axios.get(host);
    mainPage = await axios({
      method:"get",
      url:localHost
  }).catch(err=>console.log(`test ${err}`));
  }catch(error){
    console.log("test catch:"+error)
  }

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
  if(mainPage.location!=null){
    location[0] = mainPage.location.place.ashgabat;
    location[1] = mainPage.location.place.ahal;
    location[2] = mainPage.location.place.balkan;
    location[3] = mainPage.location.place.mary;
    location[4] = mainPage.location.place.dashoguz;
    location[5] = mainPage.location.place.lebap;
    location[6] = ['Balkan','Mary','Daşoguz','Lebap'];
    location[7] = ['Балкан','Мары','Дашогуз','Лебап'];
    location[8] = ['Balkan','Mary','Dashoguz','Lebap'];
  }
  res.render('main',{list:mainPage,loop,loop1,host,seeAll,seeAllBolum,sl,location,follow,hostiso})
})

app.get("/pressCenter",async function(req,res){
  var sl = req.query.sl;
  
  var data;
  try{
    data = await axios.get(`${localHost}/news`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/pressCenter.ejs",{list:data.data,host,sl,teg:'',follow,hostiso});
})


app.get('/pressCenterNews',async function(req,res){
  var tab = req.query.tab;
  var page = req.query.page;
  var limit = req.query.limit;
  var tag = req.query.tag;
  var data;
  
  if(tab == 1){
    try{
      data = await axios.get(`${localHost}/news/loadMore?page=${page}&limit=${limit}&tag=${tag}`);
    }catch(error){
      console.log(error)
    }
  }else if(tab ==2){
    try{
      data = await axios.get(`${localHost}/events/loadMore?page=${page}&limit=${limit}&tag=${tag}`);
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
    data = await axios.get(`${localHost}/news/tags?tag=${teg}`);
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
    data = await axios.get(`${localHost}/industry/front?id=${req.query.id}&index=${pudak-1}`);
  }catch(error){
    console.log(error)
  }

  console.log(data.data);

  console.log(id);
  res.render(`pages/karhana`,{data:data.data,id,pudak,host,follow,hostiso});
})

app.get("/agzalar/:id",async function(req,res){
  var datas;
  try{
    datas = await axios.get(`${localHost}/members`);
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
  

  res.render("pages/agzalar",{data,place,idd,host,follow,hostiso})
})

// Rysgal Gazeti
app.get("/gazet",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/newspapers/front`);
  }catch(error){
    console.log(error)
  }
  var page = req.query.page;
  console.log(data.data);
  res.render("pages/gazet",{data:data.data,page,host,follow,hostiso}) 
})
// sppt
app.get("/sppt",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/menu/getAboutUs`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/sppt",{host,data:data.data,follow,hostiso}) 
})

// Membership
app.get("/membership",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/menu/getMembership`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/membership",{host,data:data.data,follow,hostiso})
})

// online Business
app.get("/onlineBussiness/:welayat",async function(req,res){
  var welayat = req.params.welayat;
  
  var data;
  try{
    data = await axios.get(`${localHost}/commerce?welayat=${welayat}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/business",{host,data:data.data,welayat,follow,hostiso});
})

// businessPlan
app.get("/businessPlans",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/menu/getAllBussiness`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/plans",{host,data:data.data.bussiness,follow,hostiso})
})

// licenses
app.get("/licenses",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/menu/getLicenseHeader`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/lisense",{host,data:data.data,follow,hostiso});
})

//licensesMorePage
app.get("/licenses/:id",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/menu/getOneLicense?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/lisenseMore",{host,data:data.data,follow,hostiso})
})

// konsultasiya
app.get("/consultation",async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/menu/getConsultation`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/konsultasiya",{host,data:data.data,follow,hostiso});
})

// news
app.get('/news/:id',async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/news/getOneFront?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/news",{host,data:data.data,file:'news',follow,hostiso});
})


// events
app.get('/events/:id',async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/events/getOneFront?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data);
  res.render("pages/news",{host,data:data.data,file:'events',follow,hostiso});
})

//constructor
app.get('/constructor/:id', async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/constructor/subcategory/getOne?id=${req.params.id}`);
  }catch(error){
    console.log(error)
  }
  var page = data.data.page;
  console.log(data.data);
  if(page == '1'){
    res.render("templates/template1",{host,data:data.data,follow,hostiso});
  }else if(page == '2'){
    res.render("templates/template2",{host,data:data.data,follow,hostiso});
  }else if(page == '3'){
    res.render("templates/template3",{host,data:data.data,follow,hostiso});
  }else if(page == '4'){
    res.render("templates/template4",{host,data:data.data,follow,hostiso});
  }else if(page == '5'){
    res.render("templates/template6",{host,data:data.data,follow,hostiso});
  }else if(page == '6'){
    res.render("templates/template7",{host,data:data.data,follow,hostiso});
  }else if(page == '7'){
    res.render("templates/template8",{host,data:data.data,follow,hostiso});
  }
})










var menu;

app.get('/menuData',async function(req,res){
  data = await axios.get(`${localHost}/constructor/all`);
  console.log(data.data);
})






// admin ==========================================================================================

app.get("/admin",function(req,res){
  res.render("pages/login",{host,follow,hostiso})
})



  






// Get functions
app.get("/admin/:page",async function(req,res){
  var page = req.params.page;
  var data;
  if(page == "habarlar"){
    try{
      data = await axios.get(`${localHost}/news/getAll`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/habarlar",{data:data.data,name:"Habarlar",host:host,hostiso});
  }else if(page == "bildirishler"){
    try{
      data = await axios.get(`${localHost}/events/getAll`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/bildirishler",{data:data.data,name:"Bildirişler",host,hostiso});
  }else if(page == "rysgal"){
    try{
      data = await axios.get(`${localHost}/newspapers`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/gazetler",{data:data.data, name:"Gazetler", host,hostiso});
  }else if(page == "tstb"){
    try{
      data = await axios.get(`${localHost}/menu/getAboutUs`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/tstb",{data:data.data,name:"TSTB - biz barada",host,hostiso});
  }else if(page == "pudaklar"){
    try{
      data = await axios.get(`${localHost}/industry`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/pudaklar",{data:data.data,name:"Pudaklar",hostiso});
  }else if(page == "agzalyk"){
    try{
      data = await axios.get(`${localHost}/menu/getMembership`);
    }catch(e){
      console.log(e);
    }
    res.render("admin/agzalyk",{data:data.data,name:"Agzalyk",host,hostiso});
  }else if(page == "internetSowda"){
    try{
      data = await axios.get(`${localHost}/commerce/getAll`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/internetSowda",{data:data.data,name:"Internet Söwda",host,hostiso});
  }else if(page == "plans"){
    try{
      data = await axios.get(`${localHost}/menu/getAllBussiness`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/plans",{data:data.data.bussiness,name:"Iş meýilnamasy",host,hostiso})
  }else if(page == "ygtyyarnama"){
    try{
      data = await axios.get(`${localHost}/menu/getAllLicense`);
    }catch(e){
      console.log(e)
    }
    console.log(data.data)
    res.render("admin/lisense",{data:data.data,name:"Ygtyýarnama",host,hostiso})
  }else if(page == "maslahat"){
    try{
      data = await axios.get(`${localHost}/menu/getConsultation`);
    }catch(e){
      console.log(e)
    }
    console.log(data.data)
    res.render("admin/konsultasiya",{data:data.data,name:"Maslahat",host,hostiso})
  }else if(page == "kompaniyalar"){
    try{
      data = await axios.get(`${localHost}/members/`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/kompaniyalar",{data:data.data, name:"TSTB agzalary", host,hostiso});

  }else if(page == "partniyorlar"){
    try{
      data = await axios.get(`${localHost}/sponsor/getAll`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/partniyorlar",{data:data.data,name:"Partniýorlar"});
  }else if(page == "banner1"){
    try{
      data = await axios.get(`${localHost}/banners/getOne?id=1`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/banner1",{data:data.data.banner, name:"1-nji banner", host,hostiso});
  }else if(page == "banner2"){
    try{
      data = await axios.get(`${localHost}/banners/getOne?id=2`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/banner2",{data:data.data.banner, name:"2-nji banner", host,hostiso});
  }else if(page == "banner3"){
    try{
      data = await axios.get(`${localHost}/banners/getOne?id=3`);
    }catch(error){
      console.log(error)
    }
    
    res.render("admin/banner3",{data:data.data.banner, name:"3-nji banner", host,hostiso});
  }else if(page == "mail"){
    try{
      data = await axios.get(`${localHost}/mail/`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/mail",{data:data.data,name:"Mail subcribers",hostiso});
  }else if (page == "constructor"){
    try{
      data = await axios.get(`${localHost}/constructor/`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/constructor",{data:data.data,name:"Constructor kategoriýalar",hostiso});
  }else if(page == "karta"){
    try{
      data = await axios.get(`${localHost}/province/getProvince`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/karta",{data:data.data,name:"Karta",host,hostiso});
  }else if(page == "parol"){
    res.render('admin/parol',{name:"Parol çalyşmak",host,hostiso});
  }else if(page == "statistika"){
    try{
      data = await axios.get(`${localHost}/menu/getStatistika`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/statistika',{name:"Statistika",host,data:data.data,hostiso});
  }else if(page == 'messages'){
    try{
      data = await axios.get(`${localHost}/chat/getAll`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data)
    res.render('admin/chat',{name:"Hatlar",host,data:data.data,hostiso});
  }
})

// search
app.post("/admin/:page/search",async function(req,res){
  var page = req.params.page;
  var text = req.body.search;
  
  var link;
  var ejs;
  if(page == "Habarlar"){
    link = "news";
    ejs = "habarlar"
  }
  else if(page == "Bildirişler"){
    link = "events"
    ejs = "bildirishler"
  }
  else if(page == "Gazetler"){
    link = "newspapers"
    ejs = "gazetler"
  }
  else if(page == "TSTB agzalary"){
    link = "members"
    ejs = "kompaniyalar"
  }
  else if(page == "Internet Söwda"){
    link = "commerce"
    ejs = "internetSowda"
  }
  else if(page == "Iş meýilnamasy"){
    link = "menu/bussiness"
    ejs = "plans"
  } 
  else if(page == "Ygtyýarnama"){
    link = "menu/license"
    ejs = "lisense"
  } 
  // else if(page == "Pudaklar"){
  //   link = ""
  //   ejs = "pudaklar"
  // } 
  // else if(page == "Kärhanalar"){
  //   link = ""
  //   ejs = "karhanalar"
  // } 
  // else if(page == "Partniýorlar"){
  //   link = ""
  //   ejs = "partniyorlar"
  // }
  // else if(page == "Constructor kategoriýalar"){
  //   link = "constructor"
  //   ejs = "constructor"
  // }
  else if(page == "Sub constructorlar"){
    link = "constructor"
    ejs = "subConstructor";
  }
  var data;
  console.log(link);
  console.log(text);
  try{
    data = await axios.get(`${localHost}/${link}/searchAdmin?text=${text}`);
  }catch(error){
    console.log(error)
  }
  console.log(data.data)
  res.render(`admin/${ejs}`,{data:data.data,name:page,host:host,hostiso});
  
})


// message page
app.get("/admin/messages/:id", async function(req,res){
  var data;
  try{
    data = await axios.get(`${localHost}/chat/getOne?id=${req.params.id}`);
  }catch(e){
    console.log(e);
  }
  console.log(data.data);
  res.render("admin/oneChat",{name:"Hatlar ",host,data:data.data,hostiso});
})

// page post
app.post("/admin/:page",function(req,res){
  var page = req.params.page;
  if(page == "subConstructor"){
    var nomer = req.body.shablon;
    console.log(req.body);
    banner=nomer
    if(nomer == 1){
      res.render("admin/toAdd/shablon/shablon1",{data:req.body,name:"Sub Constructor",id:constructorId,host,hostiso});
    }else if(nomer == 2){
      res.render("admin/toAdd/shablon/shablon2",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso});
    }else if(nomer == 3){
      res.render("admin/toAdd/shablon/shablon3",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso});
    }else if(nomer == 4){
      res.render("admin/toAdd/shablon/shablon4",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }else if(nomer == 5){
      res.render("admin/toAdd/shablon/shablon5",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }else if(nomer == 6){
      res.render("admin/toAdd/shablon/shablon6",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
    }else if(nomer == 7){
      res.render("admin/toAdd/shablon/shablon7",{data:req.body,name:"Sub Constructor",host,id:constructorId,hostiso})
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
      data = await axios.get(`${localHost}/news/tag`);
      res.render("admin/toAdd/addHabarlar",{tag:data.data,name : page+" goşmak",host,hostiso});
    }catch(error){
      res.send(error);
    }
    
  }else if(page == "Bildirişler"){
    try{
      data = await axios.get(`${localHost}/events/tag`);
      res.render("admin/toAdd/addBildirishler",{tag:data.data,name : "Bildiriş goşmak",host,hostiso});
    }catch(error){
      res.send(error);
    }

  }else if(page == "Gazetler"){
    res.render("admin/toAdd/addGazetler",{name:"Gazet goşmak",host,hostiso})
  }else if(page == "Pudaklar"){
    res.render("admin/toAdd/addPudaklar",{name:"Pudak goşmak",host,hostiso})
  }else if(page == "Kärhanalar"){
    res.render("admin/toAdd/addKarhanalar",{name:"Kärhana goşmak",host,id:pudakId,hostiso})
  }else if(page == "Internet Söwda"){
    try{
      data = await axios.get(`${localHost}/commerce/getCategorySimple`);
      console.log(data.data);
      res.render("admin/toAdd/addInternetSowda",{tag:data.data,name:"Internet Söwda goşmak",host,hostiso})
    }catch(error){
      res.send(error);
    }
  }else if(page == "Iş meýilnamasy"){
    res.render("admin/toAdd/addPlans",{name:"Iş meýilnamasyny goşmak",host,hostiso})
  }else if(page == "Ygtyýarnama"){
    res.render("admin/toAdd/addLisense",{name:"Ygtyýarnama goşmak",host,hostiso})
  }else if(page == "TSTB agzalary"){
    res.render('admin/toAdd/addKompaniyalar',{name:"TSTB agza goşmak",host,hostiso});
  }else if(page == "Partniýorlar"){
    res.render("admin/toAdd/addPartniyorlar",{name:"Partniýor goşmak",host,hostiso})
  }else if(page == "1-nji banner"){
    res.render("admin/toAdd/addBanner1",{name : "Banner 1-a goşmak",host,hostiso});
  }else if(page == "2-nji banner"){
    res.render("admin/toAdd/addBanner2",{name:"2-nji bannere goşmak",host,hostiso})
  }else if(page == "3-nji banner"){
    res.render("admin/toAdd/addBanner3",{name:"3-nji bannere goşmak",host,hostiso})
  }else if(page == "Constructor kategoriýalar"){
    res.render("admin/toAdd/addConstructorKategori",{host,name:"Constructor kategoriýa goşmak",hostiso})
  }else if(page == "Sub constructorlar"){
    console.log(constructorId)
    res.render("admin/toAdd/addSubConstructor",{name:"Sub constructor goşmak",hostiso})
  }
})



// page edit
app.get("/admin/:page/edit/:id",async function(req,res){
  var page = req.params.page;
  var id = req.params.id;
  var data;
  if(page == "habarlar"){
    try{
      data = await axios.get(`${localHost}/news/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editHabarlar",{data:data.data[0],tags:data.data[1],name:"Habarlar üýtgetmek",host:host});
  }else if(page == 'bildirishler'){
    try{
      data = await axios.get(`${localHost}/events/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    res.render("admin/toEdit/editBildirishler",{data:data.data[0],tags:data.data[1],name:"Bildiriş üýtgetmek",host:host});
  }else if(page == 'gazetlar'){
    try{
      data = await axios.get(`${localHost}/newspapers/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data);
    res.render("admin/toEdit/editGazetlar",{data:data.data,name:"Gazet üýtgetmek",host:host});
  }else if (page == 'banner1'){
    try{
      data = await axios.get(`${localHost}/banners/getOneBanner?id=1&index=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner1",{data:data.data,index:req.params.id,name:"1-nji banneri üýtgetmek",host:host});
  }else if (page == 'banner2'){
    try{
      data = await axios.get(`${localHost}/banners/getOneBanner?index=${id}&id=2`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner2",{data:data.data,index:req.params.id,name:"2-nji banneri üýtgetmek",host});
  }else if (page == 'banner3'){
    try{
      data = await axios.get(`${localHost}/banners/getOneBanner?index=${id}&id=3`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editBanner3",{data:data.data,index:req.params.id,name:"3-nji banneri üýtgetmek",host});
  }else if(page == 'kompaniyalar'){
    try{
      data = await axios.get(`${localHost}/members/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editKompaniyalar",{data:data.data,id:req.params.id,name:"Kompaniýa üýtgetmek",host});
  }else if(page == 'internetSowda'){
    try{
      data = await axios.get(`${localHost}/commerce/getOne?id=${id}`);
    }catch(error){
      console.log(error)
    }
    console.log(data.data);
    res.render("admin/toEdit/editInternetSowda",{data:data.data[0],tag:data.data[1],id:req.params.id,name:"Internet Söwdany üýtgetmek",host});
  }else if(page == 'ishMeyilnamasy'){
    try{
      data = await axios.get(`${localHost}/menu/getOneBussiness?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editPlans',{data:data.data,name:"Iş meýilnamasyny üýtgetmek",host});
  }else if(page == 'ygtyyarnama'){
    try{
      data = await axios.get(`${localHost}/menu/getOneLicense?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editLisense',{data:data.data,name:"Ygtyýarnama üýtgetmek",host});
  }else if(page == "pudaklar"){
    try{
      data = await axios.get(`${localHost}/industry/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/toEdit/editPudaklar",{data:data.data,host,name:"Pudaklar üýtgetmek"});
  }else if(page == "karhanalar"){
    try{
      data = await axios.get(`${localHost}/industry/subCategory?index=${id}&id=${pudakId}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render("admin/toEdit/editKarhanalar",{data:data.data,name:"Karhanalar üýtgetmek",host,index:id,id:pudakId});
  }else if(page == 'partniyorlar'){
    try{
      data = await axios.get(`${localHost}/sponsor/getOne?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editPartniyorlar',{data:data.data,host,name:'Partniýorlar üýtgetmek'})
  }else if(page == 'constructorKategori'){
    try{
      data = await axios.get(`${localHost}/constructor/getOneSimple?id=${id}`);
    }catch(e){
      console.log(e);
    }
    console.log(data.data);
    res.render('admin/toEdit/editConstructorKategori',{data:data.data,host,name:'Constructor kategory üýtgetmek',id})
  }else if(page == 'subConstructor'){
    try{
      data = await axios.get(`${localHost}/constructor/subCategory/getOne?id=${id}`);
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
      await axios.delete(`${localHost}/news?id=${id}`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/habarlar")
  }else if(page == 'bildirishler'){
    try{
      await axios.delete(`${localHost}/events?id=${id}`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/bildirishler")
  }else if(page == 'gazetlar'){
    try{
      await axios.delete(`${localHost}/newspapers?id=${id}`);
    }catch(error){
      console.log(error)
    }
    
    res.redirect("/admin/rysgal");
  }else if(page == "banner1"){
    try{
      await axios.delete(`${localHost}/banners?index=${id}&id=1`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/banner1");
  }else if(page == "banner2"){
    try{
      await axios.delete(`${localHost}/banners?index=${id}&id=2`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/banner2");
  }else if(page == 'banner3'){
    try{
      await axios.delete(`${localHost}/banners?index=${id}&id=3`);
    }catch(error){
      console.log(error)
    }

    res.redirect("/admin/banner3");
  }else if(page == 'kompaniyalar'){
    try{
      await axios.delete(`${localHost}/members?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect("/admin/kompaniyalar");
  }else if(page == 'internetSowda'){
    try{
      await axios.delete(`${localHost}/commerce?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect("/admin/internetSowda");
  }else if(page == 'ishMeyilnamasy'){
    try{
      await axios.delete(`${localHost}/menu/deleteBussiness?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/plans');
  }else if(page == 'ygtyyarnama'){
    try{
      await axios.delete(`${localHost}/menu/deleteLicense?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/ygtyyarnama');
  }else if(page == 'partniyorlar'){
    try{
      await axios.delete(`${localHost}/sponsor?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/partniyorlar');
  }else if(page == 'pudaklar'){
    try{
      await axios.delete(`${localHost}/industry?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/pudaklar');
  }else if(page == "karhanalar"){
    try{
      await axios.delete(`${localHost}/industry/subCategory?index=${id}&id=${pudakId}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/karhanalar/'+pudakId);
  }else if(page == 'constructorKategori'){
    try{
      await axios.delete(`${localHost}/constructor?id=${id}`)
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/constructor')
  }else if(page == 'subConstructor'){
    try{
      await axios.delete(`${localHost}/constructor/subCategory?id=${id}`);
    }catch(e){
      console.log(e);
    }
    res.redirect('/admin/subConstructor/'+constructorId);
  }else if(page == 'mail'){
    try{
      await axios.delete(`${localHost}/mail?id=${id}`);
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
    data = await axios.get(`${localHost}/industry/getOne?id=${pudakId}`);
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
    data = await axios.get(`${localHost}/constructor/getOne?id=${constructorId}`)
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
