const express = require('express');
const { parseBody, verifySignature, challengeCheck } = require('./middleware/middleware');
const slackEvent = require('./slack/process-event');
const slackAuth = require('./slack/api/slackAuth');
const app = express();
require('dotenv').config();
const port = 3000;

app.use(express.static('public'));

// Serve up Emily AI's homepage
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Slack App OAuth flow
app.get('/slack/oauth', parseBody, async (req, res) => {
    // Get the access token from Slack
    process.env.SLACK_BOT_TOKEN = await slackAuth.getAccessToken(req.queryParams, res);
    res.redirect(302, 'https://db60-2601-201-8780-e960-5017-c953-27c2-e8e8.ngrok.io/');
});

// Listen to POST requests on /slack/events
app.post('/slack/events', parseBody, verifySignature, challengeCheck, async (req, res) => {
    // Respond to Slack with a 200 OK
    res.send('ok');

    // Process the Slack event
    await slackEvent.processEvent(req);
});

app.listen(Number(port), () => {
    console.log(`Server is listening on port ${port}`);
});
