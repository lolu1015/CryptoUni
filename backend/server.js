import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const app = express();
const router = express.Router();
let Student = require('./Model/student.ts')
let Module = require('./Model/module.ts')
let Application = require('./Model/application.ts')


mongoose.connect('mongodb://127.0.0.1:27017/mydb');
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

router.route('/getical').post((req, res) => {
  Student.findOne({id: req.body['name']}, function(err, student) {
    if(err) {
      res.set('Content-Type', 'text');
      res.status('500').send("Internal Error");
    } else {
      res.set('Content-Type', 'text/calendar;charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="worktile.pro.calendar.my.ics"');
      let totalString = icalprefix + getICALString(student.modules)
      res.send(totalString);
    }
  })
});

router.route('/geticalmodule').post((req, res) => {
  Student.findOne({id: req.body['name']}, function(err, student) {
    if(err) {
      res.set('Content-Type', 'text/html');
      res.status('500').send("Internal Error");
    } else {
      res.set('Content-Type', 'text/calendar;charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="worktile.pro.calendar.my.ics"');
      let totalString = getAdditionalICALString(req.body['additional']) + getICALString(student.modules)
      console.log(totalString)
      res.send(totalString);
    }
  })
});

router.route('/login').post((req, res) => {
  Student.findOne({id: req.body['name']}, function(err, student) {
    if(err) {
      res.status('500').send("Internal Error");
    } else {

      console.log(req.body['hash'])
      console.log(student.password)


      if(student && req.body['hash'] === student.password) {
        res.status('200').send("Login successful");
        console.log("??")
      } else {
        res.status('401').send("Wrong password");
        console.log("!!")
      }
    }
  })
});

router.route('/getapplication').post((req, res) => {

  res.set('Content-Type', 'text/html');
  let newApplication = new Application;
  let newModule = new Module;
  let newStudent = new Student;

  Module.findOne({id: req.body['moduleId']}, function(err, module) {if(module) {newModule = module
    Student.findOne({id: 'test'}, function(err, student) {if(student) {newStudent = student
      newApplication = new Application({id: "fdsgst54sdf4w5df45ds", status:"warten", module: [newModule], student: [newStudent], responsible: newModule.professor});
  newApplication.save((err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log("success")
      console.log("HIER: " + JSON.stringify(newApplication))
      //CamundaCall
    }
  })}});
  ;res.send("IrgendeinString")
  }});
});


function getAdditionalICALString(name) {
  let retString = ""
  console.log("Additonal Name " +  name)
  switch (name) {
    case "SWE":
      retString += "BEGIN:VCALENDAR\n" +
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
        "COLOR:RED\n" +
        "LAST-MODIFIED:20200303T221236Z\n" +
        "LOCATION:\n" +
        "SEQUENCE:0\n" +
        "STATUS:CONFIRMED\n" +
        "SUMMARY:SSD\n" +
        "COLOR:RED\n" +
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
        "END:VEVENT\n"
      break;
  }
  return retString
}

function getICALString(modules) {
  let retString = ""
  modules.forEach(mod => {
    console.log("NAME " + mod.name)
        switch (mod.name) {
          case "SSD":
            retString +=
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
            "COLOR:YELLOW\n" +
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
            "END:VEVENT\n"
            break;
        }
  })
  retString += "END:VCALENDAR\n"
  return retString
}

const icalprefix = "BEGIN:VCALENDAR\n" +
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
  "END:VTIMEZONE\n"

//dummy user

//Student.deleteMany({}).exec()

let newStudent = new Student({
  name: "Test",
  id: "test",
  password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  modules: [
    new Module({
      name: "SSD",
      id: "123",
      professor: "Test",
      description: "test"
    })
  ]
})

let newModule = new Module({
  name: "SWE",
  id: "SWE",
  professor: "Test",
  description: "test"
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

Module.find((err, res) => {
  if (err)
    console.log(err);
  else {
    if(res.length > 0) {
      console.log(JSON.stringify(res));
    } else {
      newModule.save((err, result) => {
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
