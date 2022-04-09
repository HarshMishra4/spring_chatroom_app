var stompClient = null;
var isAvatarSelected = false;
var muteNotification = false;

function sendMessage() {
    let msg = document.getElementById('msgbox');
    if (msg.value == '' || msg.value == null) return;

    let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    let data = {
        name: localStorage.getItem('name'),
        avatar: localStorage.getItem('avatar'),
        content: msg.value,
        time: currentTime
    }

    // Send Data to server
    stompClient.send("/app/message", {}, JSON.stringify(data))
    msg.value = '';
    msg.focus();

}

function showMessage(message) {
    let receivedMessage = '<div class="mt-2" style="display: flex;"><img class="chat-message-sender-avatar" src=' + message.avatar + ' alt="Avatar"><div class="col-lg-3 col-md-4 col-sm-6 col"><div style="display: flex;"><div class="col chat-message-name">' + message.name + '</div><div class="col text-end chat-message-time">' + message.time + '</div></div><div class="chat-message-sender-content">' + message.content + '</div></div></div>';
    let sentMessage = '<div class="d-flex justify-content-end mt-2"><div class="col-lg-3 col-md-4 col-sm-6 col"><div style="display: flex;"><div class="col text-start chat-message-time">' + message.time + '</div><div class="col text-end chat-message-name">You</div></div><div class="chat-message-user-content">' + message.content + '</div></div><img class="chat-message-user-avatar" src=' + message.avatar + ' alt="Avatar"></div>';
    let newElement = document.createElement('div');

    // Check whether the sender and the current user is same or not
    // Accordingly pick the widget
    if (message.name === localStorage.getItem('name')) {
        newElement.innerHTML = sentMessage;
    } else {
        newElement.innerHTML = receivedMessage;
        if (!muteNotification) $("#notification")[0].play()
    }

    let messageContainer = document.getElementById("cardBody");
    messageContainer.appendChild(newElement);
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function connect() {
    let socket = new SockJS("/server1")
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function (frame) {
        console.log("Connected : " + frame)
        $("#login-page").addClass('d-none')
        $("#chat-room").removeClass('d-none')
        stompClient.subscribe("/topic/return-to", function (response) {

            showMessage(JSON.parse(response.body))

        })
    })
}

function login() {
    var name = document.getElementById("name").value;
    if (name === null || name === '' || name.length <= 3) {
        alert("Please enter a valid name");
        return;
    }
    if (!isAvatarSelected) {
        alert("Please select an Avatar");
        return;
    }

    localStorage.setItem("name", name)
    connect()
}

function logout() {
    localStorage.removeItem("name")
    localStorage.removeItem("avatar")
    if (stompClient !== null) {
        stompClient.disconnect();
        $("#chat-room").addClass('d-none');
        $("#login-page").removeClass('d-none');
        window.location.reload();
    }
}

// Add selected emoji to input field
function addEmoji(emoji) {
    let field = document.getElementById('msgbox');
    field.value = field.value + emoji.innerHTML
    field.focus()
}

function selectAvatar(id) {
    avatar = document.getElementById(id);
    avts = document.getElementsByClassName("select-avatar")
    for (let index = 0; index < avts.length; index++) {
        const element = avts[index];
        if (element.id === id) {
            element.style.borderColor = '#3DD7B5';
            localStorage.setItem('avatar', avatar.src)
            isAvatarSelected = true;
        } else {
            element.style.borderColor = 'transparent';
        }
    }
}

/* 
    this function mutes notification
    sound when user clicks on mute button
*/
function turnOffNotificationSound() {
    muteNotification = !muteNotification;
    let button = document.getElementById('mute-button');
    if (muteNotification) {
        button.style.backgroundColor = "red";
    } else {
        button.style.backgroundColor = "#3DD7B5";
    }
}

window.onload = function () {
    // This code is to map list avatar images to 'avatars'(<div>) tag
    let images = [
        'https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png',
        'https://www.kindpng.com/picc/m/163-1636340_user-avatar-icon-avatar-transparent-user-icon-png.png',
        'https://assets.codepen.io/3610274/internal/avatars/users/default.png?fit=crop&format=auto&height=512&version=1572517024&width=512',
        'https://avatarfiles.alphacoders.com/163/thumb-163637.jpg',
        'https://image.shutterstock.com/image-vector/face-happy-girl-avatar-laughing-260nw-1459862774.jpg',
        'https://www.smashbros.com/images/og/pikachu.jpg'
    ];
    let avatars = document.getElementById('avatars');
    for (let index = 0; index < images.length; index++) {
        let ele = '<img draggable="false" onclick="selectAvatar(\'' + index + '\')" id=' + index + ' src=' + images[index] + ' class="select-avatar" alt="Avatar">';

        let newElement = document.createElement('div')
        newElement.innerHTML = ele;
        avatars.appendChild(newElement);
    }
};

$(document).ready(function () {
    // Handles event when user hits enter button
    // So when they hit enter the sendMessage() will be triggered
    $("#msgbox").keypress(function (e) {
        if (e.keyCode == 13) {
            sendMessage();
        }
    });
});
