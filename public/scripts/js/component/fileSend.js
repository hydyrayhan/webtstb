
async function dataSend(data,link){
    console.log(link)
    const option={
        method:"POST",
        body:JSON.stringify(data),
        headers:new Headers({
            'Content-Type':"application/json",
            'Access-Control-Request-Private-Network': true
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

async function statistikaTake(host){
    var data2;
    data2 = await axios({
        method:"get",
        url:`${host}/menu/getStatistika`
    })
    return data2.data;
}

async function searchData(host,data){
    var data3;
    data3 = await axios({
        method:"get",
        url:`${host}/news/search?text=${data}`
    })
    return data3.data;
}