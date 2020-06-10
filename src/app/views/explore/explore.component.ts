/* tslint:disable */
import {Component, OnInit} from '@angular/core';
import {TimetableComponent} from "../timetable/timetable.component";
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { Subject, from, merge, Observable } from 'rxjs';
import { switchMap, map, windowCount, scan, take, tap } from 'rxjs/operators';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent implements OnInit {
  public feed: Observable<Message[]>;
  chatShowing = false

  showChat() {
    this.chatShowing = true
  }

  public readonly user: User = {
    id: 1
  };

  public readonly bot: User = {
    id: 0
  };

  private local: Subject<Message> = new Subject<Message>();

  searchString = 'Suchen...'
  newModule = ""
  newDescription = ""
  dummyModules = [
    {
      module: "Software Engineering",
      name: 'SWE',
      descrip: "Software Engineering Description"
    },
    {
      module: "Software Engineering",
      name: 'SWA',
      descrip: "Software Architecture Description"
    },
    {
      module: "Operations Research",
      name: 'OR',
      descrip: "Operations Research Description"
    },
    {
      module: "Data",
      name: 'Data Mining',
      descrip: "Data Mining Description"
    },
    {
      module: "Data",
      name: 'Data Analytics',
      descrip: "Data Analytics Description"
    },
    {
      module: "Data",
      name: 'Big Data',
      descrip: "Big Data Description"
    },
  ]

  constructor(private svc: ChatService, private timeTable: TimetableComponent) {
    const hello: Message = {
      author: this.bot,
      suggestedActions: [{
        type: 'reply',
        value: 'Empfehlen!'
      }, {
        type: 'reply',
        value: 'Modulsuche!'
      }],
      timestamp: new Date(),
      text: 'Hallo, drücke Empfehlen, um dir automatisch generierte Empfehlungen anzuzeigen oder Modulsuche um basierend auf Stichwörtern Modulempfehlungen zu generieren'
    };

    // Merge local and remote messages into a single stream
    this.feed = merge(
      from([ hello ]),
      this.local,
      this.svc.responses.pipe(
        map((response): Message =>

              ({


                author: this.bot,
                text: response,
                suggestedActions: [{
                  type: 'reply',
                  value: 'Hilfe!'
                }]


              })

        )




      )
    ).pipe(
      // ... and emit an array of all messages
      scan((acc: Message[], x: Message) => [...acc, x], [])
    );
  }

  public sendMessage(e: SendMessageEvent): void {
    this.local.next(e.message);

    this.local.next({
      author: this.bot,
      typing: true
    });

    this.svc.submit(e.message.text);

    this.searchString = this.svc.searchString

  }
  ngOnInit(): void {
    this.searchString = this.timeTable.setString()
  }

  filteredModules() {
    if (this.searchString.length === 0)
      return []
    else
      return this.dummyModules.filter(mod => mod.module.toLowerCase().includes(this.searchString.toLowerCase()) || mod.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  replace(event) {
    console.log("??" + event.name)
    this.newModule = event.name
    this.newDescription = this.dummyModules.filter(module => module.name === event.name)[0].descrip
  }

  showInCalendar() {
    this.timeTable.setAdditionalModule(this.newModule)
  }
}
