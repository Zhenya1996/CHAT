function run(){
var container=document.getElementsByClassName('wrapper')[0];
container.addEventListener('click',delegateEvent);
container.addEventListener('change',delegateEvent);
}

function delegateEvent(eventObject){
    if(eventObject.type==='click' && eventObject.target.classList.contains('submit')){
        onSendButtonClick();
    }
    if(eventObject.type === 'click' && eventObject.target.classList.contains('delete')) {
        onDeleteMessageButtonClick();
    }
    if(eventObject.type === 'click' && eventObject.target.classList.contains('edit')) {
        onEditMessageButtonClick();
    }
   if(eventObject.type==='change' && eventObject.target.parentElement.classList.contains('message')){
     onCheckboxClick(event);
    } 
    
}
function onEditMessageButtonClick() {
var correctedMessage = document.getElementsByClassName('correctedMessage');
if(correctedMessage.length == 1) {
    return;
    }
    var message = document.getElementsByClassName('selected')[0];
    message.classList.add('correctedMessage');
    document.getElementById('msg-input').value = message.childNodes[3].textContent;
   
}
function onDeleteMessageButtonClick() {
    var listSelectedMessages = document.getElementsByClassName('selected');
    for(var i = listSelectedMessages.length - 1; i >=0; i--) {
        listSelectedMessages[i].remove();
    } 
   
}

function onCheckboxClick(event) {
    var messageBlock = event.target.parentElement;
    var usernameInMessage = event.target.parentElement.childNodes[1];
    
    if(usernameInMessage.textContent == document.getElementsByClassName('chat-name')[0].value) {
        onToggleMessageBlock(messageBlock);
        
    } else {
    event.target.parentNode.firstChild.checked=false;
    }
    
}
/*function  onCheckboxClick(event){
if(event.target.parentElement.classList.add('selected');
}*/


function onSendButtonClick(){
    var textMessage=document.getElementById('msg-input');
    var correctedMessage = document.getElementsByClassName('correctedMessage');
    if(correctedMessage.length == 1) {
     correctedMessage[0].childNodes[3].textContent = textMessage.value;
        textMessage.value ='';
        document.getElementsByClassName('selected')[0].firstChild.checked = false;
        correctedMessage[0].classList.remove('selected');
        correctedMessage[0].classList.remove('correctedMessage');
    return;
    }
    if(!textMessage)
        return;
    var name = document.getElementsByClassName('chat-name')[0];
    
    var message = document.createElement('div');
    message.setAttribute('class','message');
    var history = document.getElementsByClassName('chat-messages')[0];
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type','checkbox');
    message.appendChild(checkbox);
    message.appendChild(document.createTextNode(name.value));
    message.appendChild(document.createTextNode(": "));
    message.appendChild(document.createTextNode(textMessage.value+" "));
    
    textMessage.value='';
    history.appendChild(message);
}
function onDeleteMessageButtonClick() {
    var listSelectedMessages = document.getElementsByClassName('selected');
    for(var i = listSelectedMessages.length - 1; i >=0; i--) {
        listSelectedMessages[i].remove();
    }
   
   
}

function onToggleMessageBlock(blockMessage) {
    if(blockMessage.classList.contains('selected')) {
        blockMessage.classList.remove('selected');
    } else {
        blockMessage.classList.add('selected');
    }
}

