// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
    const SERVER_URL = 'http://localhost:4000/save-subscription'
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    })
    return response.json()
}

self.addEventListener('activate', async () => {
    // This will be called only once when the service worker is activated.
    try {
        const applicationServerKey = urlB64ToUint8Array(
            'BCcKdZ89JJaqD3RXYTPwiyB6FkhrNPJUnw3ORcFZvphNJHOeSMkGieAehzPKzmZciAhhx2Ag8C3pjFKrYzqmEBk'
        )
        const options = { applicationServerKey, userVisibleOnly: true }
        const subscription = await self.registration.pushManager.subscribe(options)
        const response = await saveSubscription(subscription)
        console.log(response)
    } catch (err) {
        console.log('Error', err)
    }
})

self.addEventListener("push", function (event) {
    if (event.data) {
        console.log("Push event!! ", event.data.text());
        showLocalNotification("Yolo", event.data.text(), self.registration);
    } else {
        console.log("Push event but no data");
    }
});

const showLocalNotification = (title, body, swRegistration) => {
    // const audio = new Audio('sound/subtle.mp3');
    const options = {
        body,
        "sound": "sound/subtle.mp3",
        "vibrate": [200, 100, 200, 100, 200, 100, 400],
        "silent": false,
        // "tag": "request",
        "actions": [
          { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
          { "action": "no", "title": "No", "icon": "images/no.png" }
        ]
        // here you can add more properties like icon, image, vibrate, etc.
    };
    swRegistration.showNotification(title, options);
    // audio.play();
};
// private key te8nYjHh_YHb2Xi4C7PmitURTsuiil2FTS-AVS_saAU
// public key BCcKdZ89JJaqD3RXYTPwiyB6FkhrNPJUnw3ORcFZvphNJHOeSMkGieAehzPKzmZciAhhx2Ag8C3pjFKrYzqmEBk