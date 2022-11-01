import React, { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useProfile } from "../Store/Store";
const ServiceWorker = () => {
  const axiosPrivate = useAxiosPrivate();
  const profile = useProfile((state) => state.profile);
  const publicVapidKey =
    "BOAdjt9MnI1q5FS-KrTHG1uvqFg_2K4KiqIJG7ZKpemPEJRPO0EZvEt5L_70HbLzbaUphozBGnM29md0PoTMX4Q";

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
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

   
    if (!("serviceWorker" in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!("PushManager" in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }
    // TODO add startup logic here
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/worker.js")
        .then((serviceWorkerRegistration) => {
          console.info("Service worker was registered.");
          console.info({ serviceWorkerRegistration });
        })
        .catch((error) => {
          console.error(
            "An error occurred while registering the service worker."
          );
          console.error(error);
        });
    } else {
      console.error(
        "Browser does not support service workers or push messages."
      );
    }

    //registerd service worker now we ask for permission to notify
    const subscribe = async () => {
      const result = await Notification.requestPermission();
      if (result === "denied") {
        console.error("The user explicitly denied the permission request.");
        return;
      }
      if (result === "granted") {
        console.info("The user accepted the permission request.");
      }
      const registration = await navigator.serviceWorker.getRegistration();
      const subscribed = await registration.pushManager.getSubscription();
      // if (subscribed) {
      //   console.info("User is already subscribed.");

      //   return;
      // }
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      //add client id to subscription
      
      // send subscription to node
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.post(
          `/subscriptions/${profile.clientId}`,
          JSON.stringify(subscription),
          {
            signal: controller.signal,
          }
        );
        // console.log(response);
      } catch (err) {
        console.log(err);
       
      }

      return () => {
        controller.abort();
      }

    };

    // call subscribe
    subscribe();
  }, []);
};

export default ServiceWorker;
