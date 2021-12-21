// yokardaky 7 sany static page ichine girende active edyar;

function active(num){
  var statics = document.querySelectorAll(".nav2 .left a div");
  for(var i = 0; i<statics.length; i++){
      statics[i].classList.remove("active");
  }
  statics[num].classList.add("active");
}

// session for statistica
async function user(host){
  let user = sessionStorage.getItem('tstbEnter');
  if(user==undefined){
    const option={
      method:"GET"
    }
    await fetch(`${host}/menu/addOne`)
    sessionStorage.setItem("tstbEnter","true");
  } 
}










async function changeLanguage(){
  const langLinks = document.querySelectorAll('.lang-link');
  const contentNodes = document.querySelectorAll('[data-content]');
  const dynamicNodes = document.querySelectorAll("[data-dynamic]");
  const navLang = document.querySelector('.chosen-lang');





  // Get Contents
  async function getContents(){
    const res = await fetch('/data/language.json')
    const obj = await res.json();
    return obj
  }

  window.addEventListener('load', () => onClicklangLinks())


  // Onclick event Lang Links
  function onClicklangLinks() {
    
    langLinks.forEach(a => {
        a.addEventListener('click',async (e) => {
          
            let cookieLang = a.id;
            let chosenLang = a.textContent;
            let languagee = cookieLang.toUpperCase()
            //fdsfdsfd
            document.cookie = `language = ${languagee}`
            document.cookie = `showLanguage = ${chosenLang}`
            ///fdsfdsfdsf
            localStorage.setItem('language',languagee)
            localStorage.setItem('showLanguage',chosenLang)
            changeLanguage();
            return changeUiLanguage(languagee)       
        })
    });
  }
var a = 0;
var sene = document.querySelectorAll(".date");
async function changeUiLanguage(languagee) {
  
  const contents = await getContents();
  navLang.innerText = contents[languagee][languagee];
  contentNodes.forEach(node => {
    if(node.tagName == 'INPUT'){
      if(node.id == 'toFollow'){
        node.setAttribute('value',contents[languagee][node.id])
      }else{
        node.setAttribute('placeholder',contents[languagee][node.id]);
      }
    }
    node.innerHTML = contents[languagee][node.id]
  });
  dynamicNodes.forEach(node => {
    node.innerHTML = node.dataset[languagee.toLowerCase()]
  })    
}

  async function getLangFromLocalStorage(){

    
    
    var lang = localStorage.getItem("language");
    
    if(lang == null){
      return changeUiLanguage('TM')
    }
    else{
      return changeUiLanguage(lang);
    }
  }

  getLangFromLocalStorage()
}
changeLanguage();

