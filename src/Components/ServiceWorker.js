import React, { useEffect } from 'react'

const ServiceWorker = () => {



    const publicVapidKey = "BOAdjt9MnI1q5FS-KrTHG1uvqFg_2K4KiqIJG7ZKpemPEJRPO0EZvEt5L_70HbLzbaUphozBGnM29md0PoTMX4Q"

    function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, "+")
          .replace(/_/g, "/");
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }


    useEffect(() => {

        // if service worker is available
      

        const register = async () => {
           
            const register = await navigator.serviceWorker.register("/worker.js", {
              scope: "/"
            });
            console.log("Registering service worker...", register);

            console.log("Registering Push...");
            const subscription = await register.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
            console.log("Push Registered...");
        }

        if ("serviceWorker" in navigator) {
            register();

        }

    },[]);

  
}

export default ServiceWorker