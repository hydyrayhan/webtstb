var tegSubmit = document.querySelector(".tegSubmit");
tegSubmit.addEventListener("click",async function(e){
    e.preventDefault();
    var tm = document.querySelector("form.kategori #tm").value;
    var ru = document.querySelector("form.kategori #ru").value;
    var en = document.querySelector("form.kategori #en").value;
    
    let data={
        tm,
        ru,
        en
    }
    fetchet(data,ip)
})