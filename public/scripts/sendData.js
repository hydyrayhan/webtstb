var img;
var loadFile = function(event,el) {
    var image = document.querySelectorAll('#output');
    console.log(image[el])

    image[el].src = URL.createObjectURL(event.target.files[0]);
    image[0].style.width = "100%";
    image[0].style.height = "100%";
    img = document.querySelector(".inputs p input");
};


function sendImg(link,form){
    var file = document.querySelectorAll(".box .inputs input[type='file']");
    
    


    // for(var i = 0; i<file.length;i++){
    //     file[i].addEventListener("change",function(e){
    //         console.log(this.parentNode.parentNode);
    //         var image = document.querySelectorAll('#output');
    //         var imgOne = this.parentNode.parentNode.childNodes[3].childNodes[0]
    //         // console.log(this.parentNode.parentNode.childNodes[3])
    //         // console.log(this.parentNode,"this")
    //     })
    // }


    async function send(addGalleryImage){
        var data = new FormData();
        data.append("img",addGalleryImage);

        const option = {
            method: "POST",
            body:data
        }

        await fetch(link,option);
    }

    var submit = document.querySelector(".save");

    submit.addEventListener("click",async function(e){
        // e.preventDefault()
        await send(img.files[0]);
    })

    

    var more = document.querySelector(".more");
    var yene = 1;
    more.addEventListener("click",function(){
        moreBtn(form);
        var a = document.querySelectorAll('.ql-editor p');
        for(var i = yene*3; i<(yene+1)*3;i++){
            a[i].textContent = ''
        }
        yene+=1;


        file = document.querySelectorAll(".box .inputs input[type='file']");
    })
}
let sana=1
function moreBtn(form){
    var formInside = document.querySelector("form .form2");
    formInside.innerHTML += form.innerHTML;
    // let forms=document.querySelectorAll(".form .form2 .box .inputs input[type='file']")
    let forms=document.querySelectorAll(".box .inputs input[type='file']")

    // console.log(forms[sana].parentNode);
    
    forms[sana].parentNode.innerHTML=`<input type="file"  accept="image/*" name="image${sana}" id="img" onchange="loadFile(event,${sana})" class="1" style="display: none;">`
    // console.log(forms[sana],"jfkdjjfdjlfd");

    // console.log(forms[sana-1].parentNode.parentNode)
    // console.log(form.childNodes[3].childNodes[5].childNodes[1])
    // forms.childNodes[3].childNodes[5].childNodes[1].childNodes[0].classList.add("cl"+sana)
    // form.childNodes[3].childNodes[5].classList.add("cl"+sana)
    sana+=1

}

