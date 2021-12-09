

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

    var status = await axios({
        method: 'post',
        url: link,
        data: formData
    });
    
    return status;
    
}

async function mail(link,data){
    var status = await axios({
        method: 'post',
        url: link,
        data:data
    });
    return status;
}

async function checkSend(id, link, data){
    var obj = {
        id,
        data
    }
    
    await axios({
        method: 'post',
        url: link,
        data: obj
    });
}

async function menuData(host){
    var data;
    data = await axios({
        method:'get',
        url:`${host}/constructor/all`,
    })

    return data.data;
}