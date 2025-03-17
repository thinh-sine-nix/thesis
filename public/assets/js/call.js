class User {
    /**
     * Create a user.
     * @param {User} user
     * @param {string} user.peerId
     * @param {string} user.name
     * @param {string} user.avatar
     */
    constructor({ peerId, name, avatar }) {
        this.peerId = peerId;
        this.name = name;
        this.avatar = avatar;
    }
}

/**
 * Description
 * @type {Map<string, User>}
 */
const room = new Map();

/**
 * Description
 * @type {string}
 */
let name;

const YOU = 'You';

const chatDrawer = document.querySelector('.chat');

let messageSound = new Audio('/assets/audio/message.mp3');

navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

/**
 * @param {Object} peer
 * @param {Object} stream
 * @return {function(user: User): void}
 */
const handleCall = (peer, stream) => {
    return ({ peerId: guestPeerId, name: guestName, openCamera, openMicrophone }) => {
        var call = peer.call(guestPeerId, stream, { metadata: name });
        let isStartedCamera = false;
        call.on('stream', function (stream) {
            if (!isStartedCamera) {
                isStartedCamera = true;
                room.set(guestPeerId, new User({ peerId: guestPeerId, name: guestName }));
                cameraGrid.addCamera('camera-' + guestPeerId, guestName);
                if (!openCamera) cameraGrid.toggleCameraIcon('camera-' + guestPeerId, false);
                if (!openMicrophone)
                    cameraGrid.toggleMicrophoneIcon('camera-' + guestPeerId, false);
            }
            cameraGrid.stream('camera-' + guestPeerId, stream);
        });
    };
};

/**
 * @param {Object} stream
 * @return {function(call: Object): void} remove user's camera
 */
const handleAnswer = (stream) => {
    return (call) => {
        const guestPeerId = call.peer;
        const guestName = call.metadata;
        // Answer the call, providing our mediaStream
        call.answer(stream);
        let isStartedCamera = false;
        call.on('stream', function (stream) {
            if (!isStartedCamera) {
                isStartedCamera = true;
                room.set(guestPeerId, new User({ guestPeerId, name: guestName }));
                cameraGrid.addCamera('camera-' + guestPeerId, guestName);
            }
            cameraGrid.stream('camera-' + guestPeerId, stream);
        });
    };
};

/**
 * @param {string} peerId
 * @return {function(): void} remove user's camera
 */
const handleCloseCall = (peerId) => {
    cameraGrid.removeCamera('camera-' + peerId);
    room.delete(peerId);
};

/**
 * @param {Object} stream
 */
const onSuccess = (stream) => {
    const peer = new Peer();
    peer.on('open', function (peerId) {
        // Check if a website uses HTTPS
        const isHttps = location.protocol.includes('https');
        const ws = new WebSocket(
            `${isHttps ? 'wss' : 'ws'}://${
                location.host
            }/ws?roomId=${roomId}&peerId=${peerId}&name=${name}`
        );
        // Save user information
        room.set(peerId, new User({ peerId, name }));
        // Handle functions like microphone and camera on/off
        handleCallControl(stream, ws);
        // Handle sending messages in chats.
        handleSendMessage(ws);
        ws.onmessage = ({ data }) => {
            const { type, message } = JSON.parse(data);

            switch (type) {
                case 'join_room': {
                    message.forEach(handleCall(peer, stream));
                    break;
                }
                case 'disconnect': {
                    handleCloseCall(message);
                    break;
                }
                case 'microphone': {
                    const { peerId, value } = message;
                    cameraGrid.toggleMicrophoneIcon('camera-' + peerId, value);
                    break;
                }
                case 'camera': {
                    const { peerId, value } = message;
                    cameraGrid.toggleCameraIcon('camera-' + peerId, value);
                    break;
                }
                case 'message': {
                    const { peerId: guestPeerId, value } = message;
                    if (peerId !== guestPeerId) {
                        // Play message notification sounds
                        messageSound.play();
                        // Display messages in the interface
                        createMessageSection(room.get(guestPeerId).name, value);
                    }
                    if (chatDrawer.style.display === 'none') {
                        // If the chat window is hidden, it shows a notification of new messages
                        document.querySelector('.toggle-chat span').style.display = 'block';
                    }
                    break;
                }
                default: {
                }
            }
        };
        // Receive calls from others
        peer.on('call', handleAnswer(stream));
    });
};

/**
 * @param {Object} ws websocket
 * @return {Function(value: Boolean) => void}
 */
// Create a function that sends a microphone on/off signal via WebSocket.
const sendMessageMicrophone = (ws) => {
    return (value) => {
        ws.send(JSON.stringify({ type: 'microphone', message: value }));
    };
};

/**
 * @param {Object} ws websocket
 * @return {Function(value: Boolean) => void}
 */
// Create a function that sends a camera on/off signal via WebSocket.
const sendMessageCamera = (ws) => {
    return (value) => {
        ws.send(JSON.stringify({ type: 'camera', message: value }));
    };
};

/**
 * @param {Object} stream
 * @param {Object} ws websocket
 */
const handleCallControl = (stream, ws) => {
    document
        .querySelectorAll('.toggle-audio')
        .forEach((el) => (el.onclick = () => toggleAudio(stream, sendMessageMicrophone(ws))));
    document
        .querySelectorAll('.toggle-video')
        .forEach((el) => (el.onclick = () => toggleVideo(stream, sendMessageCamera(ws))));
    document.querySelector('.leave-room').onclick = () => (window.location.href = '/');
};

const start = () => {
    navigator.getUserMedia(
        { audio: true, video: true },
        (stream) => {
            cameraGrid.addCamera('my-camera', 'You', true);
            cameraGrid.stream('my-camera', stream);
            onSuccess(stream);
        },
        (err) => console.error(err)
    );
};

document.querySelector('#create-room').onclick = async (e) => {
    // Get the username from the input field.
    name = document.querySelector('#name').value;
    if (!name) return;
    e.preventDefault();
    Cookies.set('name', name);
    // Hide the name input interface and show the video call interface. 
    document.querySelector('.join').style.display = 'none';
    document.querySelector('.call').style.display = 'block';
    start();
};

[document.querySelector('.toggle-chat'), document.querySelector('.chat-heading-close')].forEach(
    (el) =>
        (el.onclick = () => {
            // Handle hiding/showing the chat box
            if (chatDrawer.style.display === 'flex') {
                chatDrawer.style.display = 'none';
                scenary.style.right = '0px';
            } else {
                chatDrawer.style.display = 'flex';
                if (!/Android|iPhone/i.test(navigator.userAgent)) {
                    scenary.style.right = '320px';
                }
                document.querySelector('.toggle-chat span').style.display = 'none';
                chatDrawer.querySelector('form input').focus();
                scrollChatSectionToBottom();
            }
            // Adjust the camera grid
            cameraGrid.resize();
        })
);

const getTime = () => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

const scrollChatSectionToBottom = () => {
    const chatContentSectionEl = document.querySelector('.chat-content');
    chatContentSectionEl.scrollTop = chatContentSectionEl.scrollHeight;
};

const createMessageSection = (name, message) => {
    message = message.replace(/<img(.*?)>/g, '<img $1 class="chat-image" style="cursor:pointer; max-width: 100px; max-height: 100px;" />');

    const messageSection = document.createElement("div");
    messageSection.className = "chat-content-message";
    messageSection.innerHTML = `
        <span><strong>${name}</strong> <span>${getTime()}</span></span>
        <p>${message}</p>
    `;

    if (name === YOU) messageSection.classList.add("you");

    document.querySelector(".chat-content").appendChild(messageSection);
    scrollChatSectionToBottom();
};


const isURL = (str) => {
    var urlRegex =
        '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
};

function handleSendMessage(ws) {
    document.querySelector('.chat form').onsubmit = (e) => {
        e.preventDefault();
        const message = tinyMCE.activeEditor.getContent()
        if (message !== '') {
            createMessageSection(YOU, message);
            ws.send(JSON.stringify({ type: 'message', message }));
            tinymce.activeEditor.setContent("");
        }
    };

    document.querySelector('.chat form .send-btn').onclick = (e) => {
        e.preventDefault();
        const message = tinyMCE.activeEditor.getContent()
        if (message !== '') {
            createMessageSection(YOU, message);
            ws.send(JSON.stringify({ type: 'message', message }));
            tinymce.activeEditor.setContent("");
        }
    }

    const cloudName = "duswzrr6s"; //dwfzid0gk
    const uploadPreset = "ml_default"; //ml_test

    const myWidget = cloudinary.createUploadWidget(
        {
            cloudName: cloudName,
            uploadPreset: uploadPreset,
            sources: ['local', 'url', 'camera'], // Allows downloading files from device, URL, camera
            resourceType: 'auto', // Automatically recognizes file types (photos, videos, documents)
            multiple: false, // Allows selecting only 1 file at a time
        },
        (error, result) => {
            if (!error && result && result.event === "success") {
                const fileUrl = result.info.secure_url;
                const fileType = result.info.resource_type;
                const fileName = result.info.original_filename;
    
                let messageContent = "";
                if (fileType === "image") {
                    messageContent = `<img src="${fileUrl}" alt="upload" width="100px" height="100px" class="chat-image" />`;
                } else {
                    
                    const fileExtension = result.info.format 
                        ? `.${result.info.format}` 
                        : fileUrl.split('.').pop().split('?')[0]; 
    
                    messageContent = `<a href="${fileUrl}" target="_blank" class="chat-file" download>${fileName}${fileExtension}</a>`;
                }
    
                // Show file in chat
                createMessageSection(YOU, messageContent);
    
                // Send file via WebSocket
                ws.send(JSON.stringify({ type: 'message', message: messageContent }));
            }
        }
    );
    

    document.getElementById("upload_widget").addEventListener(
        "click", function () {
            myWidget.open();
        },
        false
    );
};

document.querySelector('.call .control .copy-link').onclick = () => {
    // Lấy URL hiện tại
    const fullUrl = window.location.href;

    // Cắt phần URL sau &password (nếu có)
    const baseUrl = fullUrl.split('&password')[0];

    // Sao chép URL mới
    navigator.clipboard.writeText(baseUrl).then(function() {
        alert('Copied to clipboard: ' + baseUrl);
    }).catch(function(error) {
        alert('Failed to copy: ' + error);
    });
};



tinymce.init({
    selector: ".chat-form-input",
    plugins: "emoticons",
    toolbar: "emoticons",
    toolbar_location: "bottom",
    menubar: false,
});


// call duration

let timerInterval;

const socket = new WebSocket(`ws://${window.location.host}/ws?roomId=${roomId}`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'join_room') {
        const startTime = new Date(data.message.startTime);
        startCallTimer(startTime);
    }
};

function startCallTimer(startTime) {
    if (timerInterval) clearInterval(timerInterval); // Clear existing interval

    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);

        const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');

        document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

// Open image when clicked
document.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" && event.target.closest(".chat-content-message")) {
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("fullImage");

        modal.style.display = "flex";
        modalImg.src = event.target.src;
    }
});

// Close modal when close button is pressed or outside image
document.querySelector(".close-modal").onclick = function () {
    document.getElementById("imageModal").style.display = "none";
};

document.getElementById("imageModal").onclick = function (event) {
    if (event.target === this) {
        this.style.display = "none";
    }
};
