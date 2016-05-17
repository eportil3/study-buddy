$(document).ready(function() {
    /**
   * Return a timestamp with the format "m/d/yy h:MM:ss TT"
   * @type {Date}
   */

  function timeStamp() {
  // Create a date object with the current time
    var now = new Date();

  // Create an array with the current month, day and time
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

  // Create an array with the current hour, minute and second
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

  // Determine AM or PM suffix based on the hour
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";

  // Convert hour from military time
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

  // If hour is 0, set it to 12
    time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
      if ( time[i] < 10 ) {
        time[i] = "0" + time[i];
      }
    }

  // Return the formatted string
    return date.join("/") + " " + time.join(":") + " " + suffix;
  }

  /*************************************
   * My Content
  **************************************/
  $('.combobox').combobox();

  $('[data-toggle="tooltip"]').tooltip();
  $("#gear").click(function(){
      $(".x").toggle();
  });

  $('.wacky-btn').click(function() {
    var f = $(this).parent().parent();
    f.submit();
  });

  socket.on('incoming connection', function (userId, classId) {
    console.log('incoming connection from ' + userId + ' for class' + classId);
    userSend = userId;
    $("#chatbox").modal();
  });

  socket.on('chat message', function(msg) {
    $('#messages').append('' + 
      '<li class="left clearfix">' +
      '<span class="chat-img pull-left">' +
      '<img class="img-circle" src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar">' +
      '</span>' +
      '<div class="chat-body clearfix">' +
      '<div class="header">' +
      '<small class="pull-right text-muted">' +
      '<span class="glyphicon glyphicon-time">' +
      '</span>' +
      timeStamp() +
      '</small>' +
      '</div>' +
      '<p>' + msg + '</p>' +
      '</div>' +
      '</li>'
      );
  });

  socket.on('modal hidden', function() {
    // clear chat box
    $('#messages').empty();

    $('#chatbox').modal('hide');

    userSend = null;
  });

  socket.on('video modal hidden', function() {
    $('#vidcontent').empty();
    $('#vidbox').modal('hide');
    userSend =  null;
  });

  var sendMessageFunction = function() {
    if (userSend) {
      var msg = $('#btn-input').val();
      $('#messages').append('' + 
        '<li class="right clearfix">' +
        '<span class="chat-img pull-right">' +
        '<img class="img-circle" src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar">' +
        '</span>' +
        '<div class="chat-body clearfix">' +
        '<div class="header">' +
        '<small class="text-muted">' +
        '<span class="glyphicon glyphicon-time">' +
        '</span>' +
        timeStamp() +
        '</small>' +
        '</div>' +
        '<p>' + msg + '</p>' +
        '</div>' +
        '</li>'
        );
      socket.emit('chat message', userSend, msg);
      $('#btn-input').val('');
    }
    return false;
  };

  $('#btn-input').bind("enterKey", sendMessageFunction);
  $('#btn-input').keyup(function(e){
      if(e.keyCode == 13)
      {
          $(this).trigger("enterKey");
      }
  });

  $('#btn-chat').click(sendMessageFunction);

  $('#chatbox').on('hidden.bs.modal', function () {
    // clear chat box
    $('#messages').empty();

    // emit socket
    socket.emit('modal hidden', userSend);

    userSend = null;
  });

  $('#vidbox').on('hidden.bs.modal', function() {
    $('#vidcontent').empty();
    socket.emit('video modal hidden', userSend);
    userSend = null;
  });

  
  socket.on('connect with video user', function (userId, roomName) {
    userSend = userId;
    $("#vidbox").modal();
    appearin.addRoomToElementById("vidcontent", roomName);
  });


});
