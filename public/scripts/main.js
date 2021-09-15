// async function name (){
//   const data = await fetch.get(`http://localhost:3000/data/language.json`);
//   const obj = await data.json();
//   return obj;
// }

const langLinks = document.querySelectorAll('.lang-link');
const contentNodes = document.querySelectorAll('[data-content]');
const navLang = document.querySelector('.chosen-lang');
const language = document.querySelector('.language');
const ul = document.querySelector('.language ul');





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
  
          return changeUiLanguage(languagee)       
      })
  });
}

async function changeUiLanguage(languagee) {
  const contents = await getContents();
  navLang.innerText = contents[languagee][languagee];
  contentNodes.forEach(node => {
    node.innerHTML = contents[languagee][node.id]
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


// function setLangToLocalStorage(lang){
//   localStorage.setItem(`nesibeliAdimLang`, lang)
// }
getLangFromLocalStorage()

