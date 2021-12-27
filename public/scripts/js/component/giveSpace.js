function giveSpace(text){
    var newText = '';
    for(var i = 0; i<text.length; i++){
        var letter = text[i];
        if(letter ==' '){
            newText+='&nbsp';
        }else{
            newText+=letter;
        }
    }
    return newText;
}