const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000

const vapidKeys = {
    publicKey:
        'BCcKdZ89JJaqD3RXYTPwiyB6FkhrNPJUnw3ORcFZvphNJHOeSMkGieAehzPKzmZciAhhx2Ag8C3pjFKrYzqmEBk',
    privateKey: 'te8nYjHh_YHb2Xi4C7PmitURTsuiil2FTS-AVS_saAU',
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
    'mailto:aks3555@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = '') => {
    webpush.sendNotification(subscription, dataToSend)
}

app.get('/', (req, res) => res.send('Hello World!'))

const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async subscription => {
    // DB logic to be written here. For now use dummy
    dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
    const subscription = req.body
    await saveToDatabase(subscription) //Method to save the subscription to Database
    res.json({ message: 'success' })
})

//route to test send notification
app.get('/send-notification', (req, res) => {
    const subscription = dummyDb.subscription //get subscription from your databse here.
    const message = 'Hello World'
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))