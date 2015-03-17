
function run(){
var container=document.getElementsByClassName('wrapper')[0];
container.addEventListener('click',delegateEvent);
container.addEventListener('change',delegateEvent);
}

function delegateEvent(eventObject){
    if(eventObject.type==='click' && eventObject.target.classList.contains('submit')){
        onSendButtonClick();
    }
  /*  if(eventObject.type==='change' && eventObject.target.parentElement.classList.contains('message')){
     onCheckboxClick(event);
    } //.classList.contains('submit')){*/
    
}
/*function  onCheckboxClick(event){
if(event.target.parentElement.classList.add('selected');
}*/
function onSendButtonClick(){
    var textMessage=document.getElementById('msg-input');
    if(!textMessage)
        return;
    var name = document.getElementsByClassName('chat-name')[0];
    var message = document.createElement('div');
    message.setAttribute('class','message');
    var history = document.getElementsByClassName('chat-messages')[0];
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type','checkbox');
    message.appendChild(checkbox);
    message.appendChild(document.createTextNode(name.value+": "));
    message.appendChild(document.createTextNode(textMessage.value+" "));
    textMessage.value='';
    history.appendChild(message);
}


