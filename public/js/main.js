$(document).ready(function() {
  $('.combobox').combobox();

  $('[data-toggle="tooltip"]').tooltip();
  $("#gear").click(function(){
      $("#plus").toggle();
      $(".x").toggle();
  });
  
  $(".x").click(function(){
      var row = $(this).parent().parent().parent();
      var line = $(this).parent().parent().parent().next();
      row.remove();
      line.remove();
  });

  var socket = io.connect(window.location.href);
  socket.on('greet', function (data) {
    console.log(data);
    socket.emit('respond', { message: 'Hello to you too, Mr.Server!' });
  });
});