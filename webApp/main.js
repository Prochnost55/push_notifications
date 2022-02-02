const check = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
}
const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register('service.js');
    return swRegistration;
}

const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    if(permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    }
}

const showLocalNotification = (title, body, swRegistration, audio) => {

    const options = {
        body,
        "sound": "https://cdn.kommunicate.io/kommunicate/subtle.mp3",
        "icon": "images/ccard.jpeg",
        "vibrate": [100, 50, 100],
        // here you can add more properties like icon, image, vibrate, etc.
    };
    // const options = {
    //     "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
    //     "icon": "images/ccard.jpeg",
    //     "sound": "sound/subtle.mp3",
    //     "vibrate": [200, 100, 200, 100, 200, 100, 400],
    //     "silent": false,
    //     // "tag": "request",
    //     // "actions": [
    //     //   { "action": "yes", "title": "Yes", "icon": "images/yes.png" },
    //     //   { "action": "no", "title": "No", "icon": "images/no.png" }
    //     // ]
    //   }
    swRegistration.showNotification(title, options);
    audio.play();
}
const main = async () => {
    check();
    const swRegistration = await registerServiceWorker();
    const permission =  await requestNotificationPermission();
    const audio = new Audio('sound/subtle.mp3');
    // showLocalNotification('This is title', 'this is the message', swRegistration, audio);
    window.procho = {
        showNotification: function(title, message){
            showLocalNotification(
                title || 'This is title', 
                message || 'this is the message', 
                swRegistration, 
                audio
            );
        },
        showDelayedNotification: function(){
            setTimeout(() => {
                showLocalNotification('This is title', 'this is the message', swRegistration, audio);
            },5000)
        }
    }
    window.onerror = function (msg, url, line) {
        let error = {
            message: msg,
            url: url,
            line: line
        }
        document.getElementById('error').innerHTML = JSON.stringify(error);
     }
}

// main()

// const options = {
//     "//": "Visual Options",
//     "body": "<String>",
//     "icon": "<URL String>",
//     "image": "<URL String>",
//     "badge": "<URL String>",
//     "vibrate": "<Array of Integers>",
//     "sound": "<URL String>",
//     "dir": "<String of 'auto' | 'ltr' | 'rtl'>",
//     "//": "Behavioural Options",
//     "tag": "<String>",
//     "data": "<Anything>",
//     "requireInteraction": "<boolean>",
//     "renotify": "<Boolean>",
//     "silent": "<Boolean>",
//     "//": "Both Visual & Behavioural Options",
//     "actions": "<Array of Strings>",
//     "//": "Information Option. No visual affect.",
//     "timestamp": "<Long>"
//   }