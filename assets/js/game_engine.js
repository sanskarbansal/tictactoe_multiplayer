let playerName, roomName, turn, playerReady = false;
// var rName, playerOne, playerTwo, turn; 
function boardConfig(board) {

}

function createRoom(name) {
    socket.emit('createRoom', name);
}




function joinRoom(name, rName) {
    var rName = 'room_' + rName;
    socket.emit('joinRoom', { name, rName });
}

socket.on('roomJoined', (data) => {
    var { rName, playerOne, playerTwo } = data;
    roomName = rName;
    turn = data.turn;
    if (playerOne != null) {
        $('#pn1').text(playerOne.toUpperCase());
    }
    if (playerTwo != null) {
        playerReady = true; 
        $('#pn2').text(playerTwo.toUpperCase());
    }
    $('#turn').text(turn);
    $('#roomName').text(rName[rName.length - 1]);
    $('#gameBoard').removeClass('d-none');
    $('#create-container').addClass('d-none');
    $('#join-container').addClass('d-none');
});

socket.on('chal', (data) => {
    setupBoard(data.board);
    turn = data.turn;
    $('#turn').text(turn);

});
socket.on('winner', (data) => {
    console.log("this was called"); 
    alert(data + " Won the Match");
    resetBoard(); 
    // setTimeout(resetBoard, 1000);
});
socket.on('draw', (data) => {
    alert(data); 
    resetBoard(); 
    // setTimeout(resetBoard, 1000);

});

socket.on('notready', d=>alert(d) ); 
function setupBoard(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] != null) {
            $('.cell').eq(i).text(board[i]);
        }
    }
}
function resetBoard(){
    for (let i = 0; i < 9; i++) {
        $('.cell').eq(i).text('');        
    }
}