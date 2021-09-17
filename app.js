const express = require("express");
const axios = require('axios');
const bodyParser = require("body-parser");
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



app.get('/',async function(req,res){
  // backend-den maglumat chekyar;
  // let data;
  // try{
  //   data = await axios.get(`http://10.172.16.228:5000/`);
  // }catch(error){
  //   console.log(error)
  // }
  // console.log(data.data);

  mainPage = {
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
    ads : ['kerwen1.png','kerwen2.png','kerwen3.png'],
    ads2 : ['kerwen1.png','kerwen2.png','kerwen3.png'],
    brands : [
      {
        brandlogo : "windows.png",
        brandName : "Корпорация Microsoft"
      },
      {
        brandlogo : "samsung.png",
        brandName : "Samsung Electronics Central Asia"
      },
      {
        brandlogo : "unreal.png",
        brandName : "Epic Games Unreal Engine 5 beta"
      },
      {
        brandlogo : "asus.png",
        brandName : "ASUS Republic of Gamers"
      },
      {
        brandlogo : "doner.png",
        brandName : "Сеть ресторанов McDonalds’s"
      }
    ]
  } 

  var loop = 0;
  var seeAll = false;
  if(mainPage.brands.length<9){
    loop = mainPage.brands.length;
  }else{
    loop = 9;
    seeAll = true;
  }


  res.render('main',{list:mainPage,loop,host,seeAll})
})

app.get('/loading',function(req,res){
  res.render('src/loading')
})




//Server Start
app.listen("3000",function(){
  console.log('3000 server is working');
})