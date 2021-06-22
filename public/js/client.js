const socket = io();
//get DOM elements in respective js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
//audio that will play on recieving the messeges
var audio = new Audio('./ting.mp3');


//function that will append event info to the container
const append = (message, postion) => {
  const messageElement = document.createElement("div");
  //messageElement.innerText  = time;
 

  messageElement.classList.add("message");
  messageElement.classList.add(postion);
  messageElement.innerText = message;
  messageContainer.append(messageElement);
  scrollToBottom()
  if (postion == "left") {
    audio.play();
    
  }
};

const { name } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(name);
// let name;
// do{
//    name = prompt("Enter your name to join");
// }while(!name)

//ask new user for his/her name and let the server know
socket.emit("new-user-joined", {name});




//if a new user joins,receive the name event from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
  scrollToBottom();
});

//if server sends the messages ,receive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

//if user leaves the chats ,append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`,  "right");
});

//if the forms get submitted, send serverthe message
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    //clear the message 
    messageInput.value = "";
  });



  //Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

let timerId = null
function debounce(func, timer) {
    if(timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}
let typingDiv = document.querySelector('.typing')
socket.on('typing', (data) => {
  typingDiv.innerText = `${data.name} is typing...`
    debounce(function() {
       typingDiv.innerText = ''
      
    }, 1000)
  
   
})

// Event listner on messageinput
messageInput.addEventListener('keyup', (e) => {
    socket.emit('typing', {name})
    
})



  //scroll down
  function scrollToBottom(){
    messageContainer.scrollTop = messageContainer.scrollHeight
  }