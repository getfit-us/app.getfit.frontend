console.log("Service Worker Loaded...");

self.addEventListener('push', event => {
  const data = event.data.json();
 
  const options = {
    body: data.body,
    icon: '/your icon image',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
   
  }
  event.waitUntil(
    self.registration.showNotification(data.title,    
    options))

});

this.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://app.getfit.us/dashboard")
  );
  // TODO
});