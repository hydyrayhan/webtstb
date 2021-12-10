// yokardaky 7 sany static page ichine girende active edyar;

function active(num){
  var statics = document.querySelectorAll(".nav2 .left a div");
  for(var i = 0; i<statics.length; i++){
      statics[i].classList.remove("active");
  }
  statics[num].classList.add("active");
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
            document.cookie = `language = ${languagee}`
            document.cookie = `showLanguage = ${chosenLang}`
            changeLanguage();
            return changeUiLanguage(languagee)       
        })
    });
  }

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

    var data = document.cookie;
    data = data.split(";")
    data = data.map(cookie => cookie.split('='));
    data = data.reduce((accumulator,[key,value])=>
    ({...accumulator, [key.trim()]: decodeURIComponent(value)}),{});
    
    lang = data.language
    if(data.language){
        return changeUiLanguage(lang);
    }
    else{
        return changeUiLanguage('TM')
    }
  }

  getLangFromLocalStorage()
}
changeLanguage();
