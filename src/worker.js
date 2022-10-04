console.log("Service Worker Loaded...");

document.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  document.showNotification(data.title, {
    body: "Notified by Traversy Media!",
  });
});