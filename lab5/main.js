var uniqueId = function() {
    var date = Date.now();
    var random = Math.random() * Math.random();
    return Math.floor(date * random).toString();
};

var structureMessage = function(username,text) {
    return {
        username: username,
        text: text,
        id: uniqueId()
    };
};

var allMessages = [];
function run(){
    var container=document.getElementsByClassName('wrapper')[0];
    container.addEventListener('click',delegateEvent);
    container.addEventListener('change',delegateEvent);
    restoreUsername();
    var messageHistory = restore();
    createMessageHistory(messageHistory);
   
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
    document.getElementById('msg-input').value = message.lastChild.textContent;
   
}

function onDeleteMessageButtonClick() {
    var listSelectedMessages = document.getElementsByClassName('selected');
    var id;
    for(var i = listSelectedMessages.length - 1; i >=0; i--) 
    {
        id = listSelectedMessages[i].getAttribute('message-id');
        for(var j = 0; j < allMessages.length; j++) {
            if(allMessages[j].id == id) {
                allMessages.splice(j,1);
                break;
            }
        }
        listSelectedMessages[i].remove();
    }
        
    store(allMessages);
   
}

function onCheckboxClick(event) {
    var messageBlock = event.target.parentElement;
    var usernameInMessage = event.target.parentElement.childNodes[1];
    
    if(!(usernameInMessage.textContent == document.getElementsByClassName('chat-name')[0].value)) {
         event.target.parentNode.firstChild.checked=false;
    }
    else
    {
     onToggleMessageBlock(messageBlock);
     }
    
}

function onSendButtonClick() {
    var textMessage=document.getElementById('msg-input');
    var correctedMessage = document.getElementsByClassName('correctedMessage');
    
    if(correctedMessage.length == 1) {      
        var id = correctedMessage[0].getAttribute('message-id');
        for(var i = 0; i < allMessages.length; i++) {
            if(allMessages[i].id == id) {
                editTextMessage(allMessages[i], textMessage.value);
                store(allMessages);
            }
        }
        correctedMessage[0].lastChild.textContent = textMessage.value;
        textMessage.value ='';
        document.getElementsByClassName('selected')[0].firstChild.checked = false;
        correctedMessage[0].classList.remove('selected');
        correctedMessage[0].classList.remove('correctedMessage');
        return;
    }
    
    if(!textMessage.value) {
        return;
    }
    var name = document.getElementsByClassName('chat-name')[0];
    var newMessage = structureMessage(name.value,textMessage.value);
    addMessage(newMessage);
    messageText.value = '';
    store(allMessages);
}


function onToggleMessageBlock(blockMessage) {
    if(blockMessage.classList.contains('selected')) {
        blockMessage.classList.remove('selected');
    } else {
        blockMessage.classList.add('selected');
    }
}

function addMessage(textMessage) {
   
    var message = createMessage(textMessage);
    var messages = document.getElementsByClassName('chat-messages')[0];
    allMessages.push(textMessage);
    messages.appendChild(message);
}

function createMessage(message) {
    var temp = document.createElement('div');
    var htmlAsText = '<div class="message" message-id="null">'+
            '<input type="checkbox">username'+
            '<span>: </span>'+'текст сообщения</div>';
    temp.innerHTML = htmlAsText;
    updateMessage(temp.firstChild, message);
    return temp.firstChild;
}

function updateMessage(messageBlock, message){
    messageBlock.setAttribute('message-id', message.id);
    messageBlock.childNodes[1].textContent = message.username;
    messageBlock.lastChild.textContent = message.text;
    }
    
function createMessageHistory(messageHistory) {
    for(var i = 0; i < messageHistory.length; i++)
       addMessage(messageHistory[i]);
}

function store(listToSave) {
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    localStorage.setItem("messageHistory", JSON.stringify(listToSave));
}

function restore() {
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    var item = localStorage.getItem("messageHistory");
    return item && JSON.parse(item);
}

function storeUsername() {
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }
    localStorage.setItem(("username"),JSON.stringify(document.getElementsByClassName('chat-name')[0].value));
}

function restoreUsername() {
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
        var username = localStorage.getItem(("username"));
        if(username) {
            document.getElementsByClassName('chat-name')[0].value = JSON.parse(username);
        }
    }
}

function editTextMessage(message, text) {
    message.text = text;
}
