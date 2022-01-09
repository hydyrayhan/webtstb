
const socket = io('https://tstb.gov.tm:2022');
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')



socket.on("new-user-login",(id)=>{
    localStorage.setItem("socketId",id.id);
})

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`)
})
var bool = true;
socket.on("all-messages",(messages)=>{
    if(bool){
        bool = false;
        var con = document.querySelector(".texts");
        for(var i = 0; i<messages.length; i++){
            if(messages[i].who == 'you'){
                con.innerHTML +=`<div class="admin"><span>${messages[i].message}</span>`
            }else{
                con.innerHTML +=`<div class="user"><span>${messages[i].message}</span></div>`
            }
        }
        con.innerHTML+=`</div><div id='bottommm'></div>`;
        var toBot = document.querySelector("#toBot");
        toBot.click();
    }
})
socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
})


function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}



// client tarapdaky chaty achyan button
var chatBtn = document.querySelector(".chatBtn");
chatBtn.addEventListener("click",function(){
    var id = localStorage.getItem("socketId");
    if (id == null){
        socket.emit('new-user')
    }else{
        socket.emit("login",(id));
    }
    var textPage = document.querySelector(".textPage");
    textPage.style.display="block";
})



// chaty yapyan button
var exit = document.querySelector(".textHeader .exit");
exit.addEventListener("click",function(){
    var textPage = document.querySelector(".textPage");
    textPage.style.display = 'none';
})


// send button basylanda gerek
var chat = document.querySelector(".writePage img");
chat.addEventListener("click",function(){
    userSend();
    let label = document.querySelector("#clickLabel");
    label.click();
})

//hat yazylyk enter basylandaky function;
var input = document.querySelector(".writePage input");
input.addEventListener('change',function(){
    userSend();
    let label = document.querySelector("#clickLabel");
    label.click();
})

function userSend(){
    var val = document.querySelector(".writePage input");
    var id = localStorage.getItem("socketId");
    var message = val.value;
    if(message !== ''){
        let obj={
            message,
            id
        }
        socket.emit("send-chat-message",(obj))
        var con = document.querySelector(".texts");
        var bot = document.querySelectorAll('#bottommm');
        for(var i = 0; i<bot.length; i++){
            bot[i].remove();
        }
        con.innerHTML +=`<div class="admin"><span>${val.value}</span></div></div><div id='bottommm'></div>`
        val.value = ''
        var toBot = document.querySelector("#toBot");
        toBot.click();
    }
}

socket.on("admin-message",function(message){
    var text = message.lastMessage;
    var bot = document.querySelectorAll('#bottommm');
    for(var i = 0; i<bot.length; i++){
        bot[i].remove();
    }
    var con = document.querySelector(".texts");
    con.innerHTML +=`<div class="user"><span>${text}</span></div><div id='bottommm'></div>`
    var toBot = document.querySelector("#toBot");
    toBot.click();
})

