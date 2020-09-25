const fs = require('fs');
const { writeFileSync } = require('fs')
const ics = require('ics')
const readline = require('readline');
const {google} = require('googleapis');
const rand = require("random-key");
const cod=rand.generate();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const token= {"access_token":"ya29.a0AfH6SMAp0k5TDr5YlR5uL17UGhNAmUGvRxLPCidaF6IwiSafkHzAtZCn0weoCG5zM8tvK4TmxitcHzpdjDVhmde50KBPNLAnfawnTVe0WWz3JlGAatmY02iZg1b9EqLA-ltL5jcni2yCYTHXoFU55qjDaCRkKYs8Ne4","refresh_token":"1//0fuI_JavHtJEsCgYIARAAGA8SNwF-L9Ir24xAFrHNzGq5DlEgkX3ulHHgLob28m9szotxdpFFHdQh3f1ti7-hiQCUFiFlJvyVRNc","scope":"https://www.googleapis.com/auth/calendar","token_type":"Bearer","expiry_date":1601050302480};

// Load client secrets from a local file.
const credentials = {
  "installed": {"client_id": "387427347342-fu18c8n22eporkm9gu1v5oldr6f5arn5.apps.googleusercontent.com",
      "project_id": "open-finance-202-1601046611119",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": "oUGhkC9CzBGdV1C9DCoDCV4x",
      "redirect_uris": [
          "urn:ietf:wg:oauth:2.0:oob",
          "http://localhost"
      ]
  }
};
//VAMOS A OBTENER LAS CREDENCIALES Y AUTORIZAMOS
authorize(credentials,newEvent)



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.

    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
}
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function newEvent(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2020-09-26T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2020-09-28T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [
      {'email': 'example1@hotmail.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
    'conferenceData': {
        createRequest: {requestId: cod}
      },
  };
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: "all",
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.data.htmlLink);
    console.log("HANGOUT_LINK", event.data.hangoutLink);
  });
}