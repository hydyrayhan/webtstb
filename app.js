const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const { data } = require("jquery");
const fs = require("fs")
require("dotenv").config({path:"./config/config.env"});
const host = process.env.HOST;
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");

app.use(express.static("public"))
app.use('/css',express.static(__dirname+"public/style"));
app.use('/font',express.static(__dirname+"public/style"));
app.use('/js',express.static(__dirname+"public/scripts"));
app.use('/img',express.static(__dirname+"public/pictures"));

var formidable = require("express-formidable");
const { render } = require("ejs");
app.use(formidable());




let locations;
let languageData = '';
app.get('/',async function(req,res){
  // backend-den maglumat chekyar;
  // let data;
  // try{
  //   data = await axios.get(`http://10.172.16.228:5000/`);
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
  var dynamic = {
    TM:"Salam men Aymuhammet",
    RU:"Drasti i Andrey",
    EN:"Hello i am pablo"
  }

  res.render('main',{list:mainPage,loop,loop1,host,seeAll,seeAllBolum,dynamic})
})



// app.get('/location', function(req, res){
//   res.json(locations);
// });



let tegler = [];
let page = 1;
let clicked = 1;

app.get("/pressCenter",async function(req,res){
  let boolClick = false;
  let data = fs.readFileSync("./jsons/pressCenter.json");
  data = JSON.parse(data);
  let data2 = {
    tegs : ["Bizin doreden priyektlerimiz","Umumy zatlar", "Taze onumler","Sport","Tayyarlyk","Goshgolomlar", "Gaty mohum ishler","Sporta degish zatlar","Synanshyklar"],
    ads : ['kerwen1.png','kerwen2.png','kerwen3.png'],
    ads2 : ['kerwen1.png','kerwen2.png','kerwen3.png'],
    ads3 : ['kerwen1.png','kerwen2.png','kerwen3.png'],
    list : [
      {
        pic:"news1.png",
        name:"Туркменскому бизнесу окажут финансовую поддержку по созданию ПО.",
        title:"В целях формирования цифровой экономики посредством планомерного внедрения в национальную экономику.",
        date: "31 августа 2021"
      },
      {
        pic:"news2.png",
        name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
        title:"В целях формирования цифровой экономики посредством планомерного внедрения в национальную экономику.",
        date: "31 августа 2021"
      },
      {
        pic:"news3.png",
        name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
        title:"В целях формирования цифровой экономики посредством планомерного внедрения в национальную экономику.",
        date: "30 августа 2021"
      },
      {
        pic:"news4.png",
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        title:"В целях формирования цифровой экономики посредством планомерного внедрения в национальную экономику.",
        date: "29 августа 2021"
      }
    ],
    extraNews:[
      {
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        date: "23 awgust 2021"
      },
      {
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        date: "23 awgust 2021"
      },
      {
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        date: "23 awgust 2021"
      },
      {
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        date: "23 awgust 2021"
      },
      {
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        date: "23 awgust 2021"
      },
      {
        name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
        date: "23 awgust 2021"
      }
    ],
    lowNews : [
      [
        {
          pic:"news1.png",
          name:"Туркменскому бизнесу окажут финансовую поддержку по созданию ПО.",
          date: "31 августа 2021"
        },
        {
          pic:"news2.png",
          name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
          date: "31 августа 2021"
        },
        {
          pic:"news3.png",
          name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
          date: "30 августа 2021"
        },
        {
          pic:"news4.png",
          name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
          date: "29 августа 2021"
        },
        {
          pic:"news2.png",
          name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
          date: "31 августа 2021"
        },
        {
          pic:"news3.png",
          name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
          date: "30 августа 2021"
        },
        {
          pic:"news4.png",
          name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
          date: "29 августа 2021"
        },
        {
          pic:"news2.png",
          name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
          date: "31 августа 2021"
        },
        {
          pic:"news3.png",
          name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
          date: "30 августа 2021"
        }
      ],
      [
        {
          pic:"news1.png",
          name:"Туркменскому бизнесу окажут финансовую поддержку по созданию ПО.",
          date: "31 августа 2021"
        },
        {
          pic:"news2.png",
          name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
          date: "31 августа 2021"
        },
        {
          pic:"news3.png",
          name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
          date: "30 августа 2021"
        },
        {
          pic:"news4.png",
          name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
          date: "29 августа 2021"
        },
        {
          pic:"news2.png",
          name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
          date: "31 августа 2021"
        },
        {
          pic:"news3.png",
          name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
          date: "30 августа 2021"
        },
        {
          pic:"news4.png",
          name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
          date: "29 августа 2021"
        },
        {
          pic:"news2.png",
          name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
          date: "31 августа 2021"
        },
        {
          pic:"news3.png",
          name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
          date: "30 августа 2021"
        }
      ]
    ]
  }

  // console.log(req.query.page);
  // let data3;
  // try{
  //   data3 = await axios.get(`http://10.192.168.43:5000/pressCenter?page=${req.query.page}`);
  // }catch(error){
  //   console.log(error)
  // }

  tegler = []
  for(var i = 0; i<data.tegs.length;i++){
    tegler.push(data.tegs[i])
  }

  let queryPage = Number(req.query.page)
  if(page<req.query.page){
    page = queryPage;
  }else{
    page = 1;
  }
  let queryClicked = Number(req.query.clicked)
  if(clicked<req.query.clicked){
    clicked = queryClicked;
    boolClick = true;
  }else{
    clicked = 1;
  }

  if(req.query.page>1){
    var hide = false
    res.render("pages/pressCenter.ejs",{list:data2,host,page,clicked,boolClick,hide});
  }else{
    var hide = true;
    res.render("pages/pressCenter1.ejs",{list:data,host,page,clicked,boolClick,hide});
  }
})


app.get("/karhana/:id",function(req,res){
  var data = fs.readFileSync("./jsons/karhana.json");
  data = JSON.parse(data);
  var id = req.params.id
  res.render(`pages/karhana`,{data,id});
})

app.get('/tegs',function(req,res){
  res.json(tegler);
})

app.get("/text",function(req,res){

  res.render("textEditor");
})

// Edyan ishi yok
app.get('/lowNews',function(req,res){
  list = [
    {
      pic:"news1.png",
      name:"Туркменскому бизнесу окажут финансовую поддержку по созданию ПО.",
      date: "31 августа 2021"
    },
    {
      pic:"news2.png",
      name:"Торговые предприятия «Мерв» и «Лебап» будут преобразованы в акционерные общества",
      date: "31 августа 2021"
    },
    {
      pic:"news3.png",
      name:"Обсужден проект Закона Туркменистана «О систе ме сельскохозяйственного консультирования в Туркменистане»",
      date: "30 августа 2021"
    },
    {
      pic:"news4.png",
      name:"Рассмотрены результаты работы Чрезвычайной комиссии Туркменистана по борьбе с распространением болезней",
      date: "29 августа 2021"
    }
  ]
  res.send(list);
})


//Server Start
app.listen("3000",function(){
  console.log('3000 server is working');
})