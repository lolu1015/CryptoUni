/* tslint:disable */
import {Component, OnInit, Injectable, ViewChild} from '@angular/core';
import timeGrid from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import {HttpClient} from "@angular/common/http";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {DatabaseService} from "../../service";
import {LoginComponent} from "../login/login.component";
import {load} from "@progress/kendo-angular-intl";

let savedTitle = ""
let loadAddtionalModule = ""
let addtionalId = ""

declare var ICAL: any;

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
@Injectable({
  providedIn: 'root'
})



export class TimetableComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarPlugins = [dayGridPlugin, timeGrid, interactionPlugin];
  calendarEvents
  showModule = "m"
  sampleEvents = [
    {
      title: 'Mathe 1',
      start: '2020-06-04T09:30',
      end: '2020-06-04T10:30',
      extendedProps: {module: 'Mathe'},
      description: 'Beispieltext für Mathe 1'
    },
    {
      title: 'SWA',
      start: '2020-06-05T10:30',
      end: '2020-06-05T11:30',
      extendedProps: {module: 'Software Engineering'},
      description: 'Beispieltext für SWA'
    },
    {
      title: 'Data Mining',
      start: '2020-06-05T13:00',
      end: '2020-06-05T14:30',
      extendedProps: {module: 'Data'},
      description: 'Beispieltext für Data Analytics'
    }
  ];

  showEvent = false
  eventTitle = ''
  eventInformation = ''
  event

  newTitle = ''
  newStart = '2020-06-05T10:30'
  newEnd = '2020-06-05T10:30'
  newModule = ''
  newDescription = ''
  start
  end

  application = false

  constructor(private service: DatabaseService, private userService: LoginComponent) {
  }

  ngOnInit(): void {

    console.log("§§§ " +  loadAddtionalModule)
    if (loadAddtionalModule.length > 0) {
      this.application = true
      //this.reloadData()
      this.init()
    } else {
      this.application = false
      this.init()
    }
  }

  eventClicked(event) {
    console.log("?!")
    console.log(event.event.title)
    this.showEvent = true
    this.event = event
    this.eventTitle = event.event.title
    this.eventInformation = event.event.extendedProps.description
  }

  setSearchText() {
    savedTitle = this.event.event.title;
    localStorage.setItem('searchString', savedTitle)
  }

  dismissSearchText() {
    this.eventTitle = '';
    savedTitle = "";
  }

  addEvent() {
    this.calendarEvents.push({
      title: this.newTitle,
      start: this.newStart,
      end: this.newEnd,
      extendedProps: {module: this.newModule},
      description: this.newDescription
    })

  }


  data

  init() {
    this.service.getICAL(this.userService.getId()).subscribe(data => {
      console.log("asdad " + JSON.stringify(data))
      this.data = data
      this.weekClicked()
    }, error => {
      console.log("errorrr?????")
    })
  }

  weekClicked() {
    this.calendarEvents = []
    recur_events = []
    this.sampleEvents.forEach(e => {
      this.calendarEvents.push(e)
    })
    fc_events(this.data, undefined, this.calendarEvents)
    this.start = this.calendarComponent.getApi().view.currentStart
    this.end = this.calendarComponent.getApi().view.currentEnd
    expand_recur_events(this.start, this.end, this.calendarEvents)
  }

  reloadData() {
    this.service.getICALModule(loadAddtionalModule).subscribe(data => {
      this.data = data
      this.weekClicked()
    })
  }

  deleteSelection() {
    loadAddtionalModule = ""
    this.application = false
    this.init()
  }

  setAdditionalModule(module, id) {
    loadAddtionalModule = module
    addtionalId = id
  }

  apply() {
    this.service.pushApplication(this.userService.getId(), addtionalId).subscribe();
  }
}


/*MIT License

Copyright (c) 2019 https://github.com/leonaard

  Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
  */
// Depends on ./ical_events.js


// Depends on https://raw.github.com/mozilla-comm/ical.js/master/build/ical.js

function ical_events(ical, event_callback, recur_event_callback) {
  jcal_events(ICAL.parse(ical), event_callback, recur_event_callback)
}

function jcal_events(jcal, event_callback, recur_event_callback) {
  let vevents_comp = new ICAL.Component(jcal).getAllSubcomponents('vevent')
  vevents_comp.forEach(function(vvent, i){
    if( vvent.hasProperty('rrule') ){
      recur_event_callback(vvent)
    } else {
      event_callback(vvent)
    }
  })
}

function event_duration(event) {
  return new Date(event.getFirstPropertyValue('dtend').toJSDate() - event.getFirstPropertyValue('dtstart').toJSDate()).getTime()
}

function event_dtend(dtstart, duration) {
  return new ICAL.Time().fromJSDate(new Date(dtstart.toJSDate().getTime() + duration))
}

function expand_recur_event(event, dtstart, dtend, event_callback) {
  let exp = new ICAL.RecurExpansion({
    component:event,
    dtstart:event.getFirstPropertyValue('dtstart')
  })

  let duration = event_duration(event)
  while (! exp.complete && exp.next() < dtend) {

    if (exp.last >= dtstart) {
      event = new ICAL.Component(event.toJSON())
      event.updatePropertyWithValue('dtstart', exp.last)
      event.updatePropertyWithValue('dtend', event_dtend(exp.last, duration))
      event_callback(event)
    }
  }
}

// Depends on ./ical_events.js

let recur_events = []

function an_filter(string) {
  // remove non alphanumeric chars
  return string.replace(/[^\w\s]/gi, '')
}

function moment_icaltime(moment) {
    return new ICAL.Time().fromJSDate(moment)
}

function expand_recur_events(start, end, calendarEvents) {
  let events = []

  recur_events.forEach(function(event, i){
    let event_properties = event.event_properties
    expand_recur_event(event, moment_icaltime(start), moment_icaltime(end), function(event){
      fc_event(event, function(event){
        events.push(merge_events(event_properties, merge_events({className:['recur-event']}, event)))
      })
    })
  })
  events.forEach(e => {
    calendarEvents.push(e)
  })
}

function fc_events(ics, event_properties, calendarEvents) {
  let events = []
  ical_events(
    ics,
    function(event){
      fc_event(event, function(event){
        events.push(merge_events(event_properties, event))
      })
    },
    function(event){
      event.event_properties = event_properties
      recur_events.push(event)
    }
  )
  events.forEach(e => {
    calendarEvents.push(e)
  })
  return events
}

function merge_events(e, f) {
  // f has priority
  for (let k in e) {
    if (k == 'className') {
      f[k] = [].concat(f[k]).concat(e[k])
    } else if (! f[k]) {
      f[k] = e[k]
    }
  }
  return f
}

function fc_event(event, event_callback) {

  if(loadAddtionalModule.length > 0) {
    console.log('ENTERED')
    console.log(loadAddtionalModule)
    console.log(event.getFirstPropertyValue('summary'))
    console.log(event.getFirstPropertyValue('summary').includes(loadAddtionalModule))
  }




  let e = {
    title:event.getFirstPropertyValue('summary'),
    extendedProps: {module: event.getFirstPropertyValue('description')},
    description: event.getFirstPropertyValue('description'),
    //uncomment if you want to use click on date as forwarding-link
    //url:event.getFirstPropertyValue('url'),
    id:event.getFirstPropertyValue('uid'),
    color: (loadAddtionalModule.length > 0 && event.getFirstPropertyValue('summary').includes(loadAddtionalModule)) ? 'RED' : event.getFirstPropertyValue('color'),

    className:['event-'+an_filter(event.getFirstPropertyValue('uid'))],
    allDay:false
  }
  try {
    e['start'] = event.getFirstPropertyValue('dtstart').toJSDate()
  } catch (TypeError) {
    return
  }
  try {
    e['end'] = event.getFirstPropertyValue('dtend').toJSDate()
  } catch (TypeError) {
    e['allDay'] = true
  }

  console.log(JSON.parse(localStorage.getItem('user')).currentModules.map(mod => " " + mod.name))


  if(JSON.parse(localStorage.getItem('user')).currentModules.map(mod => " " + mod.name).indexOf(e.title) !== -1 || (loadAddtionalModule.length >  0 &&e.title.indexOf(loadAddtionalModule) !== -1)) {
    event_callback(e)
  } else {

  }
}
