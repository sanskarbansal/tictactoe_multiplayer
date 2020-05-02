$('#join-here').on('click', (e) => {
    e.preventDefault();
    $('#join-container').removeClass('d-none');
    $('#create-container').addClass('d-none');
});
$('#create').on('click', (e) => {
    e.preventDefault();
    $('#join-container').addClass('d-none');
    $('#create-container').removeClass('d-none');
});
$('#createRoomForm').on('submit', (e) => {
    e.preventDefault();
    playerName = $('#cname').val();
    createRoom(playerName);

});
$('#joinRoomForm').on('submit', (e) => {
    e.preventDefault();
    playerName = $('#name').val();
    let rNumber = $('#room').val();
    joinRoom(playerName, rNumber);
})


$('.cell').on('click', function (e) {
    if (playerName === turn) {
        var cellNumber = $(this).prop('id');
        socket.emit('chal', { playerName, cellNumber });
    } else {
        alert('This is not your turn');
    }
}); 