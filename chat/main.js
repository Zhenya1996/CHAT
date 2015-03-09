$(document).ready(function () {
    var addMessage = function () {
        var msg = $('textarea[name="msg-area"]').val();
        var name = $('.chat-name').val();
        $('.chat-messages').append('<div class="msg-data">' + name + ' : ' + msg + '</div>');
        $('textarea[name="msg-area"]').val('');
    } 
    $('.submit').click(addMessage);
    $('textarea[name="msg-area"]').keypress(function(e){
        if(e.which == 13){
            e.preventDefault();
            addMessage();
        }
    });
});