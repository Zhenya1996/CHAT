'use strict';

var uniqueId = function() {
    var date = Date.now();
    var random = Math.random() * Math.random();
    return Math.floor(date * random).toString();
};

var structureMessage = function(date,username,text) {
    return {
        date: date,
        username: username,
        text: text,
        id: uniqueId()
    };
};
var appState = {
    mainUrl : 'http://localhost:999/chat',
    allMessages:[],
    token : 11
};


function run(){
    var container=document.getElementsByClassName('wrapper')[0];
    container.addEventListener('click',delegateEvent);
    container.addEventListener('change',delegateEvent);
 setInterval('restore()',1000);  
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
if(checkOutServerStatus() != true) {
        alert("—ервер недоступен!");
        return;
    }
/*var correctedMessage = document.getElementsByClassName('correctedMessage');
if(correctedMessage.length == 1) {
    return;
    }*/
    var message = document.getElementsByClassName('selected')[0];
       message.classList.add('correctedMessage');
    document.getElementById('msg-input').value = message.lastChild.textContent;
   
}

function onDeleteMessageButtonClick() {
  if(checkOutServerStatus() != true) {
        alert("can not reach server!");
        return;
    }
    var listSelectedMessages = document.getElementsByClassName('selected');
    var id;
    for(var i = listSelectedMessages.length - 1; i >=0; i--) {
        id = listSelectedMessages[i].getAttribute('message-id');
        for(var j = 0; j < appState.allMessages.length; j++) {
            if(appState.allMessages[j].id == id) {
                deleteRequest(appState.mainUrl, JSON.stringify(appState.allMessages[j]));
                appState.allMessages.splice(j,1);
                break;
            }
        }
        listSelectedMessages[i].remove();
    }
   
}


    function onCheckboxClick(event) {
    var messageBlock = event.target.parentElement;
    var usernameInMessage = event.target.parentElement.childNodes[3];
    
    if(!(usernameInMessage.textContent == document.getElementsByClassName('chat-name')[0].value)) {
         event.target.parentNode.firstChild.checked=false;
    }
    else
    {
     onToggleMessageBlock(messageBlock);
     }
    
}

    
//zhenya

function onSendButtonClick() {
 if(checkOutServerStatus() != true) {
        alert("can not reach server!");
        return;
    }
    var textMessage=document.getElementById('msg-input');
    var correctedMessage = document.getElementsByClassName('correctedMessage');
      if(correctedMessage.length == 1) {
        var id = correctedMessage[0].getAttribute('message-id');
        for(var i = 0; i < appState.allMessages.length; i++) {
            if(appState.allMessages[i].id == id) {
                editTextMessage(appState.allMessages[i], textMessage.value);
                put(appState.mainUrl, JSON.stringify(appState.allMessages[i]));
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
    var name = document.getElementsByClassName('chat-name')[0].value;
    var now = new Date();
    var date = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
    var newMessage = structureMessage(date,name,textMessage.value);
        post(appState.mainUrl, JSON.stringify(newMessage));
   textMessage.value= '';
   var scroll =  document.getElementsByClassName('chat-messages')[0];
    scroll.scrollTop = scroll.scrollHeight;
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
    appState.allMessages.push(textMessage);
    messages.appendChild(message);
}

function createMessage(message) {
   var temp = document.createElement('div');
            var htmlAsText = '<div class="message" message-id="null">'+
            '<input type="checkbox">дата'+'<span> [</span>'+'<span class="usernameInMessageHistory">username</span>'+
            '<span>] </span>'+'текст сообщени€</div>';
    temp.innerHTML = htmlAsText;
    updateMessage(temp.firstChild, message);
    return temp.firstChild;
}

function updateMessage(messageBlock, message){

    messageBlock.setAttribute('message-id', message.id);
     messageBlock.childNodes[1].textContent = message.date;
    messageBlock.childNodes[3].textContent = message.username;//3
    messageBlock.lastChild.textContent = message.text;
    }
function onToggleServerStatus(bool) {
    var status = document.getElementsByClassName('status')[0];
    if(bool == true) {
        status.textContent = 'Status:ON';
    } else {
        status.textContent = 'Status:OFF';
    }
}

function checkOutServerStatus() {
    var status = document.getElementsByClassName('status')[0];
    if(status.textContent == 'Status:ON') {
        return true;
    } else {
        return false;
    }
}
function createMessageHistory(messageHistory) {
    for(var i = 0; i < messageHistory.length; i++){
       addMessage(messageHistory[i]);
       //alert(JSON.stringify(messageHistory[i]));
       
       }
}

function restore(continueWith) {
    var url = appState.mainUrl + '?token=' + 'TN' + appState.token + 'EN';

    get(url, function(responseText) {
        console.assert(responseText != null);

        var response = JSON.parse(responseText);

        appState.token += response.messages.length * 8;
        createMessageHistory(response.messages);
        if(response.messages.length != 0) {
            var scroll = document.getElementsByClassName('chat-messages')[0];
            scroll.scrollTop = scroll.scrollHeight;
        }

        continueWith && continueWith();
    });
}

function editTextMessage(message, text) {
    message.message = text;
}

function defaultErrorHandler(message) {
    console.error(message);
    output(message);
}

function get(url, continueWith, continueWithError) {
    ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
    ajax('POST', url, data, continueWith, continueWithError);
}

function put(url, data, continueWith, continueWithError) {
    ajax('PUT', url, data, continueWith, continueWithError);
}

function deleteRequest(url, data, continueWith, continueWithError) {
    ajax('DELETE', url, data, continueWith, continueWithError);
}

function isError(text) {
    if(text == "")
        return false;

    try {
        var obj = JSON.parse(text);
    } catch(ex) {
        return true;
    }

    return !!obj.error;
}

function ajax(method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();

    continueWithError = continueWithError || defaultErrorHandler;
    xhr.open(method || 'GET', url, true);

    xhr.onload = function () {
        if (xhr.readyState !== 4)
            return;

        if(xhr.status != 200) {
            continueWithError('Error on the server side, response ' + xhr.status);
            onToggleServerStatus(false);
            return;
        }

        if(isError(xhr.responseText)) {
            continueWithError('Error on the server side, response ' + xhr.responseText);
            onToggleServerStatus(false);
            return;
        }

        onToggleServerStatus(true);
        continueWith(xhr.responseText);
    };

    xhr.ontimeout = function () {
        continueWithError('Server timed out !');
        onToggleServerStatus(false);
    }

    xhr.onerror = function (e) {
        onToggleServerStatus(false);
        var errMsg = 'Server connection error !\n'+
            '\n' +
            'Check if \n'+
            '- server is active\n'+
            '- server sends header "Access-Control-Allow-Origin:*"';

        continueWithError(errMsg);
    };

    xhr.send(data);
}