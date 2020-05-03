let playerName, roomName, turn, playerReady = false;
// var rName, playerOne, playerTwo, turn; 
function boardConfig(board) {

}
function popUp(content) {
    var div = document.createElement('div');
    div.classList.add('popup');
    var newContent = document.createTextNode(content);
    div.append(newContent);
    $('body').append(div);
    $('#gameBoard').addClass('blur')
    $('.popup').fadeOut(1500, () => {
        $('#gameBoard').removeClass('blur');
        $('.popup').remove();
    });
}

function createRoom(name) {
    socket.emit('createRoom', name);
}


socket.on('err', (d) => {
    popUp(d);
});

function joinRoom(name, rName) {
    var rName = 'room_' + rName;
    socket.emit('joinRoom', { name, rName });
}

socket.on('roomJoined', (data) => {
    var { rName, playerOne, playerTwo, board } = data;
    setupBoard(board);
    roomName = rName;
    turn = data.turn;
    if (playerOne != null) {
        $('#pn1').text(playerOne.toUpperCase());
    }
    if (playerTwo != null) {
        playerReady = true;
        $('#pn2').text(playerTwo.toUpperCase());
    }
    $('#turn').text(turn.toUpperCase());
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
    popUp(data + " Won the Match");
    resetBoard();
    // setTimeout(resetBoard, 1000);
});
socket.on('draw', (data) => {
    popUp(data);
    resetBoard();
    // setTimeout(resetBoard, 1000);

});

socket.on('notready', d => popUp(d));
function setupBoard(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] != null) {
            $('.cell').eq(i).text(board[i]);
        }
    }
}
function resetBoard() {
    for (let i = 0; i < 9; i++) {
        $('.cell').eq(i).text('');
    }
}

function sendMessage(msg) {
    socket.emit('message', msg);
    $('#msg').val(''); 
}

socket.on('message', (data) => {
    renderMessage(data);
});


function renderMessage(data) {
    console.log(data); 
    let html;
    if (playerName != null && playerName == data.playerName) {
        html = `
            <div class="message self">
                <div class="sender">
                    <p>You</p>
                </div>
                <div class="content">
                    <p>${data.message}</p>
                </div>
            </div>
            `;
    }else{
        html = `
            <div class="message">
                <div class="sender">
                    <p>${data.playerName}</p>
                </div>
                <div class="content">
                    <p>${data.message}</p>
                </div>
            </div>
            `;
    }
    $('#messages').html($('#messages').html()+html);
    document.getElementById('messages').scrollBy(0, 50); 
}