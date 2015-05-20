var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames;
var namesUsed;
var currentRoom;

exports.listen = function(server) {
  io = socket.io.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function(socket) {
    // 接続したユーザにゲスト名を割り当てる
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    // 接続したユーザをLobbyに参加させる
    joinRoom(socket, 'Lobby');
    
    // ユーザのメッセージ、名前変更とルーム作成/変更の要求を処理する
    handleMessageBroadcasting(socket, nickNames);
    handleNameChangeAttempts(socket, nickNames, namesUserd);
    handleRoomJoining(socket);
    
    // ユーザの要求に応じて、ルームのリストを提供する
    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets, manager.rooms);
    });
    
    // ユーザが接続を断ったとき、クリーンアップする
    handleClientDisconnection(socket, nickNames, namesUsed);
  });
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber;

  nickNames[socket.io] = name;

  socket.emit('nameResult', {
    success: true,
    name: name
  });
  namesUsed.push(name);

  return guestNumber + 1;
}
