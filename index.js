const fs = require('fs');
const { writeFileSync } = require('fs')
const ics = require('ics')
const readline = require('readline');
const {google} = require('googleapis');
const rand = require("random-key");
const cod=rand.generate();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const token= {"access_token":"ya29.a0AfH6SMDUuRa02CRwA2GaE7PZIu89mnwyyUJjb6_SG1C0kdomX-3DK5j7B_NGyA5Wym5Cnkx4ile_--_mOREUs5tXN7NDrjcretB7pKls7yhm9eboJ8SO6X39u6Slnm8NX6Jsn800iXADSOQuxraEfe8puzoVYd-dP14","refresh_token":"1//0fvP6qYC3ideHCgYIARAAGA8SNwF-L9Irr2YgxwAkscw5ITjOaS4jQitp0XlpWaD4ic2YRcxjwAA-6JwDbmoMNIpiFHsNYkTHWPc","scope":"https://www.googleapis.com/auth/calendar","token_type":"Bearer","expiry_date":1600731440924};

// Load client secrets from a local file.
/*fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), newEvent);
});*/
const credentials = {"installed":{"client_id":"523100534189-v21amakqskfgtidncmhf9a9bvnvoj5ih.apps.googleusercontent.com","project_id":"quickstart-1600727321967","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"w4x2_zgX2GSEbrajhqTc_Li-","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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
      {'email': 'emir.mendoza@micorreo.upp.edu.mx'},
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

  ics.createEvent({
    title: event.summary,
    description: event.description,
    start:[2018, 1, 15, 6, 50], //Fecha y hora de inicio del evento con formato [2018, 1, 15, 6, 30],
    end:[2018, 2, 15, 6, 50], //Fecha y hora de finalizacion del evento con formato [2018, 1, 15, 6, 30],
    url: event.hangoutLink,
    attendees:[{email:'example1@gmail.com', role:'REQ-PARTICIPANT',},{email:'example2@gmail.com',role:'REQ-PARTICIPANT',}] ,
    duration: { minutes: 50 }
  }, (error, value) => {
    if (error) {
      console.log(error)
    }
  
    writeFileSync(`${__dirname}/event.ics`, value)
  })
}