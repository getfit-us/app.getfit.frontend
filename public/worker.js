console.log("Service Worker Loaded...");

if (!window.location.hostname.includes("getfit.us")) {
  self.addEventListener("push", (event) => {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: "https://app.getfit.us/GETFIT-LOGO.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  });
}

this.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://app.getfit.us/dashboard"));
  // TODO
});
