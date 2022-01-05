// const socket = io('http://10.192.168.44:3000');
// const socket = io('https://95.85.118.228:3000');
const socket = io('https://tstb.gov.tm:2022');
// const socket = io('http://10.192.168.51:3000');
// console.log(hostiso);
socket.emit("admin-login")
socket.on("new-messages",()=>{
    alert("You have new messages")
})

var audio = document.querySelector("#audio");


var userId='';
var globalText='';


function sendMessage(){
    var text = document.querySelector(".input input");
    userId = document.querySelector(".userId");
    var chatText = text.value;
    globalText = text.value;
    text.value = ''
    var obj ={
        text:chatText,
        user:userId.textContent
    }
    socket.emit("admin-send",(obj));
    audio.play();
}

socket.on("admin-success",()=>{
    var chatCon = document.querySelector(".chatCon");
    var a = `<div class="chat admin"><span>${globalText}</span></div>`
    var con = document.querySelector(".chatCon");
    con.innerHTML +=a;
    var toBottom = document.querySelector("#toBottom");
    toBottom.click();
});

socket.on('chat-message',(message)=>{
    var messageId = message.message.id;
    var messageText = message.message.message;
    var pageHeader = document.querySelector(".pageHeader");

    audio.play();
    if(pageHeader.innerHTML == '<span>Hatlar</span>'){
    }else if(pageHeader.innerHTML == '<span>Hatlar </span>'){
        var text = document.querySelector(".userId");
        userId = text;
    }
    if(userId == ''){
        alert("Täze hat geldi!!!");
    }else{
        if(userId.textContent == messageId){
            var a = `<div class="chat user"><span>${messageText}</span></div>`
            var con = document.querySelector(".chatCon");
            con.innerHTML +=a;
            var toBottom = document.querySelector("#toBottom");
            toBottom.click();
        }else{
            alert("Täze hat geldi!!!");
        }
    }
})