// signalRService.js
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://20.6.73.133:5269/notificationHub", {
        accessTokenFactory: () => localStorage.getItem('token'),
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, null])
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Event handlers
connection.onclose((error) => {
    console.log("Connection closed:", error);
});

connection.onreconnecting((error) => {
    console.log("Reconnecting:", error);
});

connection.onreconnected((connectionId) => {
    console.log("Reconnected with ID:", connectionId);
});

// Message handler
connection.on("ReceiveNotification", (message) => {
    console.log("New notification:", message);
    // Replace alert with your notification system
    alert(message);
});

// Start connection with retry logic
async function startConnection() {
    try {
        await connection.start();
        console.log("SignalR Connected");
    } catch (err) {
        console.error("SignalR Connection Error:", err);
        setTimeout(startConnection, 10000); // Retry after 10 seconds
    }
}

startConnection();

export default connection;