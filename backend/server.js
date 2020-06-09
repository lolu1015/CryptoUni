import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const app = express();
const router = express.Router();
let Student = require('./Model/student.ts')
let Module = require('./Model/module.ts')


mongoose.connect('mongodb://127.0.0.1:27017/mydb');
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

const iCalString = "BEGIN:VCALENDAR\n" +
  "PRODID:-//Google Inc//Google Calendar 70.9054//EN\n" +
  "VERSION:2.0\n" +
  "CALSCALE:GREGORIAN\n" +
  "X-WR-CALNAME:calmozilla1@gmail.com\n" +
  "X-WR-TIMEZONE:America/Los_Angeles\n" +
  "BEGIN:VTIMEZONE\n" +
  "TZID:America/Los_Angeles\n" +
  "X-LIC-LOCATION:America/Los_Angeles\n" +
  "BEGIN:DAYLIGHT\n" +
  "TZOFFSETFROM:-0800\n" +
  "TZOFFSETTO:-0700\n" +
  "TZNAME:PDT\n" +
  "DTSTART:20200308T090000\n" +
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\n" +
  "END:DAYLIGHT\n" +
  "BEGIN:STANDARD\n" +
  "TZOFFSETFROM:-0700\n" +
  "TZOFFSETTO:-0800\n" +
  "TZNAME:PST\n" +
  "DTSTART:20201101T090000\n" +
  "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\n" +
  "END:STANDARD\n" +
  "END:VTIMEZONE\n" +
  "BEGIN:VEVENT\n" +
  "DTSTART;TZID=America/Los_Angeles:20200301T090000\n" +
  "DTEND;TZID=America/Los_Angeles:20200301T100000\n" +
  "RRULE:FREQ=DAILY\n" +
  "DTSTAMP:20200303T221236Z\n" +
  "UID:tgh9qho17b07pk2n2ji3gluans@google.com\n" +
  "CREATED:20200303T221236Z\n" +
  "DESCRIPTION:Software Engineering\n" +
  "LAST-MODIFIED:20200303T221236Z\n" +
  "LOCATION:\n" +
  "SEQUENCE:0\n" +
  "STATUS:CONFIRMED\n" +
  "SUMMARY:SSD\n" +
  "TRANSP:OPAQUE\n" +
  "BEGIN:VALARM\n" +
  "ACTION:EMAIL\n" +
  "DESCRIPTION:Software Engineering\n" +
  "SUMMARY:Alarm notification\n" +
  "ATTENDEE:mailto:calmozilla1@gmail.com\n" +
  "TRIGGER:-P0DT0H30M0S\n" +
  "END:VALARM\n" +
  "BEGIN:VALARM\n" +
  "ACTION:DISPLAY\n" +
  "DESCRIPTION:This is an event reminder\n" +
  "TRIGGER:-P0DT0H30M0S\n" +
  "END:VALARM\n" +
  "END:VEVENT\n" +
  "END:VCALENDAR\n"


router.route('/getical').get(cors(), (req, res) => {
  res.set('Content-Type', 'text/calendar;charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="worktile.pro.calendar.my.ics"');
  res.send(iCalString);
});

//dummy user

//Student.deleteMany({}).exec()

let newStudent = new Student({
  name: "Test",
  id: "1234",
  password: "1234",
  modules: [
    new Module({
      name: "SSD",
      id: "123",
      professor: "Test",
      description: "test"
    })
  ]
})





Student.find((err, res) => {
  if (err)
    console.log(err);
  else {
    if(res.length > 0) {
      console.log(JSON.stringify(res));
    } else {
      newStudent.save((err, result) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log("success")
        }
      })
    }
  }
});

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));
