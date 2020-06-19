import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {SHA256, enc} from "crypto-js";
import { HttpClient } from '@angular/common/http';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const app = express();
const router = express.Router();
const https = require('https')

const jwt = require("jsonwebtoken");
const privateKey = "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611"


function generateAccessToken(username) {
  // expires after 30 mins
  return jwt.sign(username, privateKey, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  // get the jwt token from header
  const authHeader = req.headers['authorization']
  let token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401) // no token

  jwt.verify(token, privateKey, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next() // execute actual api call
  })
}







let User = require('./Model/user.ts')
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

// try to scrap the html / pdf code
/*const crawler = require('crawler-request');
crawler("https://www.hs-karlsruhe.de/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WIIB_SPO_V6/20160407_WIIB_B102_V6_EinfuehrungWirtschaftsinformatik.pdf").then(function(response){
  // handle response
  console.log(response.text);
});*/

// returns descriptions of modules as pdf by the id of module
router.route('/pdf').get(authenticateToken, (req, res) => {
  console.log(req.query.id)
  let data = [];
  let path = ""
  switch (req.query.id) {
    case "3123123":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161221_WII_M310_V1_Wiss-Arb.pdf"
      break;
    case "123123":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161219_WII_M120_V1_Process-Design.pdf"
      break;
    case "123131":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161219_WII_M220_V1_Service-Solution-Design.pdf"
      break;
    case "1231":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161219_WII_M230_V1_Data-Science.pdf"
      break;
    case "123323":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161219_WII_M230_V1_Data-Science.pdf"
      break;
    case "123323":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161219_WII_M230_V1_Data-Science.pdf"
      break;
    case "13323":
      path = "/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WII_M_SPO_07/20161219_WII_M230_V1_Data-Science.pdf"
      break;
  }


  let request = https.request({'host': 'www.hs-karlsruhe.de',
      'path': path//'/fileadmin/hska/IWI/PDF/Modulbeschreibungen/WIIB_SPO_V6/20160407_WIIB_B102_V6_EinfuehrungWirtschaftsinformatik.pdf',
    },
    function (response) {
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        data.push(chunk)
      });

      response.on('end', function(){
        var jsfile = new Buffer.concat(data)
        res.contentType("application/pdf");
        res.send(jsfile);
      })

    });
  request.end();
})

//returns ical with authorization username/password (compares hash values)
router.route('/icalAPI').get((req, res) => {
  console.log(req.query.password)
  let hashedPassword = SHA256(req.query.password).toString(enc.Hex)
  console.log(hashedPassword)
  User.findOne({id: req.query.id}, function(err, user) {
    if(err) {
      res.status('500').send("Internal Error");
    } else {
      if(user && hashedPassword === user.password) {
        let data = "";
        let request = https.request({'host': 'www.iwi.hs-karlsruhe.de',
            'path': '/intranet/userfiles/File/ical/reju1027.ics',
            'auth': 'reju1027:cryptocopy'
          },
          function (response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
              data += chunk
            });

            response.on('end', function(){
              res.set('Content-Type', 'text/calendar;charset=utf-8');
              res.set('Content-Disposition', 'attachment; filename="cryptoCalendar.ics"');
              res.send(data);
            })

          });
        request.end();
      } else {
        res.status('401').send("No Authorization");
      }
    }
  })
});

//gets called by frontend - no authorization implemented (would authorizize with jwt given by login)
router.route('/ical').get(authenticateToken, (req, res) => {
        let data = "";
        let request = https.request({'host': 'www.iwi.hs-karlsruhe.de',
            'path': '/intranet/userfiles/File/ical/reju1027.ics',
            'auth': 'reju1027:cryptocopy'
          },
          function (response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
              data += chunk
            });

            response.on('end', function(){
              res.set('Content-Type', 'text/calendar;charset=utf-8');
              res.set('Content-Disposition', 'attachment; filename="cryptoCalendar.ics"');
              res.send(data);
            })

          });
        request.end();
});

//returns ical file of specific module + ical file with all other visited modules
router.route('/geticalmodule').get(authenticateToken, (req, res) => {

      let data = "";
      let request = https.request({'host': 'www.iwi.hs-karlsruhe.de',
          'path': '/intranet/userfiles/File/ical/reju1027.ics',
          'auth': 'reju1027:cryptocopy'
        },
        function (response) {
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
            data += chunk
          });

          response.on('end', function(){
            res.set('Content-Type', 'text/calendar;charset=utf-8');
            res.set('Content-Disposition', 'attachment; filename="cryptoCalendar.ics"');
            let finalICAL = data.slice(0, data.length-13) + getAdditionalICALString(req.query.id) + data.slice(data.length-13);
            res.send(finalICAL);
          })

        });
      request.end();

});

// returns all modules from db
router.route('/getModules').get(authenticateToken, (req, res) => {
  Module.find((err, versions) => {
    if (err)
      console.log(err);
    else res.json(versions);
  });
})

// returns 200 if login successfull otherwise 401
router.route('/login').post((req, res) => {
  User.findOne({id: req.body['id']}, function(err, user) {
    if(err) {
      res.status('500').send("Internal Error");
    } else {
      if(user && req.body['hash'] === user.password) {
        let token = generateAccessToken({id: req.body['id']})
        console.log('your token ' + token)
        res.status('200').json({token: token, user: user});
      } else {
        res.status('401').send("Wrong password");
      }
    }
  })
});

// takes new applications by frontend
// calls camunda service (new application which has to be accepted/declined by professor)
router.route('/apply').post(authenticateToken, (req, res) => {

  res.set('Content-Type', 'text/html');
  let newApplication = new Application;
  let newModule = new Module;
  let newUser = new User;

  Module.findOne({id: req.body['moduleId']}, function(err, module) {if(module) {newModule = module
    User.findOne({id: 'test'}, function(err, student) {if(student) {newUser = student
      newApplication = new Application({id: "fdsgst54sdf4w5df45ds", status:"warten", module: [newModule], student: [newStudent], responsible: newModule.professor});
      newApplication.save((err, result) => {
        if (err) {
          console.log(err)
        }
        else {
          console.log("success")
          console.log("HIER: " + JSON.stringify(newApplication))
          //CamundaCall

          // Sending and receiving data in JSON format using POST method
          //
          var xhr = new XMLHttpRequest();
          var url = "http://localhost:7070/engine-rest/message";
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var json = JSON.parse(xhr.responseText);
              console.log('AHHHAA: ');
            }
          };
          var data = JSON.stringify({
            "messageName" : "camundaEndMessageEvent",
            "processVariables" : {
              "moduleNew__id" : {"value" : newApplication.module[0]._id, "type": "String"},
              "moduleNew_name" : {"value" : newApplication.module[0].name, "type": "String"},
              "moduleNewId" : {"value" : newApplication.module[0].id, "type": "String"},
              "moduleNew_professor" : {"value" : newApplication.module[0].professor, "type": "String"},
              "student__id" : {"value" : newApplication.student[0]._id, "type": "String"},
              "student_name" : {"value" : newApplication.student[0].name, "type": "String"},
              "studentId" : {"value" : newApplication.student[0].id, "type": "String"},
              "status" : {"value" : newApplication.status, "type": "String"},
              "moduleStandard__id" : {"value" : newApplication.student[0].modules[0]._id, "type": "String"},
              "moduleStandard_name" : {"value" : newApplication.student[0].modules[0].name, "type": "String"},
              "moduleStandardId" : {"value" : newApplication.student[0].modules[0].id, "type": "String"},
              "moduleStandard_professor" : {"value" : newApplication.student[0].modules[0].professor, "type": "String"},
              "moduleStandard_description" : {"value" : newApplication.student[0].modules[0].description, "type": "String"},
            }

          });
          console.log("Vergleiche: " + newApplication);
          console.log("Vergleiche: " + JSON.stringify(newApplication.student[0].modules));

          xhr.send(data);
          xhr.onloadend = function () {
            console.log("done")
          };

        }
      })}});
    ;res.send("IrgendeinString")
  }});
});


router.route('/getApplications').get(authenticateToken, (req, res) => {
  console.log('triggered')
  console.log(req.query.id)
  Application.find({student: {$elemMatch: {id: req.query.id}}}, function (err, appl) {
    if (appl) {
      res.status(200)
      res.json(appl)
    } else {
      res.status(200)
    }
    ;
  })
})


//dummy ical strings for previewing it in a current timetable
function getAdditionalICALString(name) {
  let retString = ""
  console.log("Additonal Name " +  name)
  switch (name) {
    case "123131":
      retString +=
        "BEGIN:VEVENT\n" +
        "DTSTART;TZID=America/Los_Angeles:20200301T110000\n" +
        "DTEND;TZID=America/Los_Angeles:20200301T123000\n" +
        "RRULE:FREQ=DAILY;INTERVAL=3\n" +
        "DTSTAMP:20200303T221236Z\n" +
        "UID:tgh9qho17b07pk2n2ji3gluans@google.com\n" +
        "CREATED:20200303T221236Z\n" +
        "DESCRIPTION:Software & Solution Design\n" +
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
        "DESCRIPTION:Software & Solution Design\n" +
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
    case "3123123":
      retString += "BEGIN:VEVENT\n" +
        "DTSTART;TZID=America/Los_Angeles:20200301T130000\n" +
        "DTEND;TZID=America/Los_Angeles:20200301T143000\n" +
        "RRULE:FREQ=DAILY;INTERVAL=3\n" +
        "DTSTAMP:20200303T221236Z\n" +
        "UID:tgh9qho17b07pk2n2ji3gluans@google.com\n" +
        "CREATED:20200303T221236Z\n" +
        "DESCRIPTION:Wissenschaftliches Arbeiten\n" +
        "COLOR:RED\n" +
        "LAST-MODIFIED:20200303T221236Z\n" +
        "LOCATION:\n" +
        "SEQUENCE:0\n" +
        "STATUS:CONFIRMED\n" +
        "SUMMARY:WiA\n" +
        "COLOR:RED\n" +
        "TRANSP:OPAQUE\n" +
        "BEGIN:VALARM\n" +
        "ACTION:EMAIL\n" +
        "DESCRIPTION:Wissenschaftliches Arbeiten\n" +
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
    case "1231":
      retString += "BEGIN:VEVENT\n" +
        "DTSTART;TZID=America/Los_Angeles:20200301T150000\n" +
        "DTEND;TZID=America/Los_Angeles:20200301T163000\n" +
        "RRULE:FREQ=DAILY;INTERVAL=3\n" +
        "DTSTAMP:20200303T221236Z\n" +
        "UID:tgh9qho17b07pk2n2ji3gluans@google.com\n" +
        "CREATED:20200303T221236Z\n" +
        "DESCRIPTION:Data Mining\n" +
        "COLOR:RED\n" +
        "LAST-MODIFIED:20200303T221236Z\n" +
        "LOCATION:\n" +
        "SEQUENCE:0\n" +
        "STATUS:CONFIRMED\n" +
        "SUMMARY:DM\n" +
        "COLOR:RED\n" +
        "TRANSP:OPAQUE\n" +
        "BEGIN:VALARM\n" +
        "ACTION:EMAIL\n" +
        "DESCRIPTION:Data Mining\n" +
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
    case "123123":
      retString += "BEGIN:VEVENT\n" +
        "DTSTART;TZID=America/Los_Angeles:20200301T140000\n" +
        "DTEND;TZID=America/Los_Angeles:20200301T153000\n" +
        "RRULE:FREQ=DAILY;INTERVAL=3\n" +
        "DTSTAMP:20200303T221236Z\n" +
        "UID:tgh9qho17b07pk2n2ji3gluans@google.com\n" +
        "CREATED:20200303T221236Z\n" +
        "DESCRIPTION:Process Design & Impl.\n" +
        "COLOR:RED\n" +
        "LAST-MODIFIED:20200303T221236Z\n" +
        "LOCATION:\n" +
        "SEQUENCE:0\n" +
        "STATUS:CONFIRMED\n" +
        "SUMMARY:PDI\n" +
        "COLOR:RED\n" +
        "TRANSP:OPAQUE\n" +
        "BEGIN:VALARM\n" +
        "ACTION:EMAIL\n" +
        "DESCRIPTION:Process Design & Impl.\n" +
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
    case "13123":
      retString += "BEGIN:VEVENT\n" +
        "DTSTART;TZID=America/Los_Angeles:20200301T140000\n" +
        "DTEND;TZID=America/Los_Angeles:20200301T153000\n" +
        "RRULE:FREQ=DAILY;INTERVAL=3\n" +
        "DTSTAMP:20200303T221236Z\n" +
        "UID:tgh9qho17b07pk2n2ji3gluans@google.com\n" +
        "CREATED:20200303T221236Z\n" +
        "DESCRIPTION:Big Data\n" +
        "COLOR:RED\n" +
        "LAST-MODIFIED:20200303T221236Z\n" +
        "LOCATION:\n" +
        "SEQUENCE:0\n" +
        "STATUS:CONFIRMED\n" +
        "SUMMARY:Big Data\n" +
        "COLOR:RED\n" +
        "TRANSP:OPAQUE\n" +
        "BEGIN:VALARM\n" +
        "ACTION:EMAIL\n" +
        "DESCRIPTION:Big Data\n" +
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




// MOCK DATA

User.deleteMany({}).exec()

let newUser = new User({
  name: "Bobby Lee",
  id: "bo1021",
  password: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  modules: [
    new Module({
      name: "SSD",
      id: "123",
      professor: "Test",
      description: "test"
    }),
    new Module({
      name: "Marketing",
      id: "123",
      professor: "Test",
      description: "test"
    }),
    new Module({
      name: "Produktionsorganisation",
      id: "123",
      professor: "Test",
      description: "test",
      grade: 1.0
    })
  ],
  role: "student"
})

newUser.save((err, succ) => {
  if (err) {
    console.log(err)
  } else {
    console.log('succ')
  }
})

  let newModule = new Module({
    name: "SWE",
    id: "SWE",
    professor: "Test",
    description: "test",
    grade: 3.7
  })

  newModule.save((err, succ) => {
    }
  )

  let newAdmin = new User({
    name: "admin",
    id: "admin",
    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    modules: [],
    role: "admin"
  })

  newAdmin.save((err, succ) => {
    if (err) {
      console.log(err)
    } else {
      console.log('succ')
    }
  })


  Module.deleteMany({}).exec()

  let allModules = [
    new Module({
      name: "Wissenschaftliches Arbeiten",
      id: '3123123',
      module: 'Wissenschaftliches Arbeiten',
      description: "Beispielbeschreibung für WiA"
    }),
    new Module({
      name: "Service & Solution Design",
      id: '123131',
      module: 'Software Design',
      description: "Beispielbeschreibung SSD"
    }),
    new Module({
      name: "Process Design & Impl.",
      id: '123123',
      module: 'Software Design',
      description: "Beispielbeschreibung PDI"
    }),
    new Module({
      name: "Data Mining",
      id: '1231',
      module: 'Data Science',
      description: "Data Mining Description"
    }),
    new Module({
      name: "Data Analytics",
      id: '123323',
      module: 'Data Science',
      description: "Data Analytics Description"
    }),
    new Module({
      name: "Big Data",
      id: '13123',
      module: 'Data Science',
      description: "Big Data Description"
    })
  ]

  allModules.forEach(module => {
    module.save((err, succ) => {
      if (err) {
        console.log(err)
      } else {
        console.log('succ')
      }
    })
  })


  Application.deleteMany({}).exec()

  let testApplication1 = new Application({
    id: 123,
    status: "pending",
    module: [new Module({
      name: "Big Data",
      id: '13123',
      module: 'Data Science',
      description: "Big Data Description"
    })],
    student: [new User({
      name: "Bobby Lee",
      id: "bo1021"
    })],
    responsible: "some prof",
  })

  let testApplication2 = new Application({
    id: 123,
    status: "pending",
    module: [new Module({
      name: "Data Analytics",
      id: '123323',
      module: 'Data Science',
      description: "Data Analytics Description"
    })],
    student: [new User({
      name: "Bobby Lee",
      id: "bo1021"
    })],
    responsible: "some prof",
  })


  testApplication1.save((err, succ) => {
    if (succ)
      console.log('appl succ')
  })

  testApplication2.save((err, succ) => {
    if (succ)
      console.log('appl succ')
  })


  app.use('/', router);
  app.listen(4000, () => console.log(`Express server running on port 4000`));
