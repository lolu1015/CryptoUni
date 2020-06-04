import { Component, OnInit, Injectable } from '@angular/core';
import timeGrid from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';


let savedTitle = ""

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
@Injectable({
  providedIn: 'root'
})



export class TimetableComponent implements OnInit {

  calendarPlugins = [dayGridPlugin, timeGrid, interactionPlugin];
  calendarEvents: EventInput[] = [
    { title: 'Mathe 1', start: '2020-06-04T09:30', end: '2020-06-04T10:30', extendedProps: {module: 'Mathe'}, description: 'Beispieltext für Mathe 1'},
    { title: 'SWA', start: '2020-06-05T10:30', end: '2020-06-05T11:30', extendedProps: {module: 'Software Engineering'}, description: 'Beispieltext für SWA'},
    { title: 'Data Mining', start: '2020-06-05T13:00', end: '2020-06-05T14:30', extendedProps: {module: 'Data'}, description: 'Beispieltext für Data Analytics'}
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

  constructor() { }

  ngOnInit(): void {
  }

  eventClicked(event) {
    console.log(event.event.title)
    this.showEvent = true
    this.event = event
    this.eventTitle = event.event.title
    this.eventInformation = event.event.extendedProps.description
  }

  setSearchText() {
    savedTitle = this.event.event.extendedProps.module;
  }

  dismissSearchText() {
    this.eventTitle = '';
    savedTitle = "";
  }

  setString() {
    return savedTitle
  }

  addEvent() {
    this.calendarEvents.push({
     title:  this.newTitle, start: this.newStart, end: this.newEnd, extendedProps: {module: this.newModule}, description: this.newDescription
    })

  }
  };

