document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    var userInput = document.getElementById("userInput").value;
    var fileInput = document.getElementById("fileInput").files[0];
    var formData = new FormData();

    if (userInput) {
        formData.append("prompt", userInput);
    }

    if (fileInput) {
        formData.append("file", fileInput);
    }

    if (userInput || fileInput) {
        var chatbox = document.getElementById("chatbox");
        if (userInput) {
            chatbox.innerHTML += "<p><strong>You:</strong> " + userInput + "</p>";
        }
        if (fileInput) {
            chatbox.innerHTML += "<p><strong>You uploaded a file:</strong> " + fileInput.name + "</p>";
        }

        fetch("/chat", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                chatbox.innerHTML += "<p><strong>Error:</strong> " + data.error + "</p>";
            } else {
                chatbox.innerHTML += "<p><strong>Bot:</strong> " + data + "</p>";
            }
            document.getElementById("userInput").value = "";
            document.getElementById("fileInput").value = "";
            chatbox.scrollTop = chatbox.scrollHeight;
        })
        .catch(error => {
            chatbox.innerHTML += "<p><strong>Error:</strong> " + error.message + "</p>";
            console.error('There was an error!', error);
        });
    }
}
