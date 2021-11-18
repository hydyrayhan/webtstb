async function dataSend(data,link){
    const option={
        method:"POST",
        body:JSON.stringify(data),
        headers:new Headers({
            'Content-Type':"application/json"
        })
    }
    var status = await fetch(link,option);
    return status.json();
}

async function imgSend(data,link){
    var formData = new FormData();
    for(var i = 0; i<data.length;i++){
        formData.append(`pic${i}`,data[i]);
    }

    const option={
        method:"POST",
        body:formData,
        headers:new Headers({
            'Content-Type':"application/json"
        }),
        mode:'no-cors'
    }
    var status = await fetch(link,option);
    return status.json();
}