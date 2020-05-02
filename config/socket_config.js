var io = null, socketConnections = {};
var count = 0;
//Remove player on disconnect. 
function removeFromRoom(roomName, playerName, sid) {
    var sConnection = socketConnections[roomName];
    if (sConnection.playeOneSid == sid) {
        sConnection.playeOneSid = null;
        sConnection.playerOne = null;
    } else {
        sConnection.playerTwo = null;
        sConnection.playerTwoSid = null;
    }
    socketConnections[roomName] = sConnection;

};
function joinRoom(playerName, rName, socket) {
    if (count <= [rName.length - 1] && socketConnections[rName]) {


        socket.join(rName);
        socketConnections[rName].playerTwo = playerName;
        socketConnections[rName].playerTwoSid = socket.id;

        var { playerOne, playerTwo, turn } = socketConnections[rName];

        io.in(rName).emit('roomJoined', { rName, playerOne, playerTwo, turn });
    } else {
        socket.emit('error', 'Error while joining the room.');
    }
}

//Verify and Place the X or O //moveChal(playerTwo, playerOne, turn, socket, playerName); 
function moveChalHelper(cellNumber, board) {
    if (cellNumber > 9 || cellNumber < 0) {
        return -1;
    }
    if (board[cellNumber] != null) {
        return -1;
    }
    return 1;
}
function moveChal(rName, playerName, cellNumber) {
    cellNumber--;
    if(!socketConnections[rName]){
        return; 
    }
    var board = socketConnections[rName].boardConfig;
    var { playerTwo, playerOne, turn } = socketConnections[rName];
    if (turn === playerName && moveChalHelper(cellNumber, board) != -1) {
        if (playerName === playerOne) {
            socketConnections[rName].turn = playerTwo;
            board[cellNumber] = 'X';
            turn = socketConnections[rName].turn;
        } else if (playerName === playerTwo) {
            socketConnections[rName].turn = playerOne;
            turn = socketConnections[rName].turn;
            board[cellNumber] = 'O';
        }
        socketConnections[rName].boardConfig = board;
        io.in(rName).emit('chal', { turn, board });
        var isWinner = checkWinner(board);
        if (isWinner != -1) {
            socketConnections[rName].boardConfig = new Array(9); 
            io.in(rName).emit('winner',playerName);
            return;
        } else if (isDraw(board)) {
            socketConnections[rName].boardConfig = new Array(9); 
            io.in(rName).emit('draw', 'This Is Draw Try Next Time');
            return;
        }
    }
}
//Let users join the room. 
function createRoom(name, socket) {
    var newConnection = new socketConnection(name, socket.id);
    var rName = newConnection.roomName;
    playerName = name;
    socketConnections[rName] = newConnection;
    socket.join(rName);
    io.in(rName).emit('roomJoined', { rName, playerOne: newConnection.playerOne, playerTwo: newConnection.playerTwo, turn: newConnection.turn });
    return rName;
}

//
class socketConnection {
    constructor(name, sid) {
        this.roomName = this.getRoomName();
        this.playerOne = name;
        this.playeOneSid = sid;
        this.playerTwoSid = null;
        this.playerTwo = null;
        this.boardConfig = new Array(9);
        this.turn = this.playerOne;
        count++;
    }

    getRoomName() {
        var count = 0;
        Object.keys(socketConnections).forEach((key) => {
            if (socketConnections[key].playerOne == null && socketConnections[key].playerTwo == null) {
                return key;
            }
            count++;
        });
        return 'room_' + ++count;
    }
}

module.exports = function (server) {
    io = require('socket.io')(server);

    io.on('connection', (socket) => {


        var rName = null, playerName = null, sid = socket.id;
        socket.on('createRoom', (data) => {
            playerName = data;
            turn = playerName;
            playerOne = playerName;
            rName = createRoom(data, socket);
        });

        socket.on('joinRoom', (data) => {
            playerName = data.name;
            playerTwo = data.name;
            rName = data.rName;
            joinRoom(playerName, rName, socket);
        });

        socket.on('chal', (data) => {
            moveChal(rName, playerName, data.cellNumber);
        });
        socket.on('disconnect', () => {
            if (rName != null) {
                removeFromRoom(rName, playerName, sid);
            }
        });

    });
}



function checkWinner(board) {

    if (board[0] == board[1] && board[1] == board[2] && board[0] != null) { // 0 1 2
        return board[0];
    } else if (board[3] == board[4] && board[4] == board[5] && board[5] != null) { //3 4 5 
        return board[3];
    } else if (board[6] == board[7] && board[7] == board[8] && board[8] != null) {// 6 7 8 
        return board[6];
    } else if (board[0] == board[3] && board[3] == board[6] && board[6] != null) { // 0 3 6 
        return board[0];
    } else if (board[1] == board[4] && board[4] == board[7] && board[7] != null) {// 1 4 7 
        return board[1];
    } else if (board[2] == board[5] && board[5] == board[8] && board[8] != null) { // 2 5 8
        return board[2];
    } else if (board[0] == board[4] && board[4] == board[8] && board[8] != null) { // 0 4 8
        return board[0];
    } else if (board[2] == board[4] && board[4] == board[6] && board[6] != null) { // 2 4 6
        return board[2];
    }
    return -1;
}


function isDraw(board) {
    for (let i = 0; i < 9; i++) {
        if (board[i] == null) {
            return false;
        }
    }
    return true;
}