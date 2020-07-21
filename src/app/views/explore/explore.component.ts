/* tslint:disable */
import {Component, OnInit} from '@angular/core';
import {TimetableComponent} from "../timetable/timetable.component";
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { Subject, from, merge, Observable } from 'rxjs';
import { switchMap, map, windowCount, scan, take, tap } from 'rxjs/operators';
import { ChatService } from './chat.service';
import {DatabaseService} from "../../service";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})

export class ExploreComponent implements OnInit {

  // chat bot settings
  public feed: Observable<Message[]>;
  chatShowing = false
  reload = true

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

  modulHandbuch
  searchString = 'Suchen...'
  newModule = ""
  newModuleName = ""
  newDescription = ""
  modules = []
  showPDF = false

  constructor(private svc: ChatService, private timeTable: TimetableComponent, private service: DatabaseService) {
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
  //chatbot
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
    //if called from timetable module pre-set search string
    this.searchString = localStorage.getItem('searchString')
    this.service.getModules().subscribe((res: []) => {
      this.modules = res
    })
  }

  filteredModules() {

    console.log(this.modules)


    if (!this.searchString || this.searchString.length === 0)
      return []
    else {
      let prefilteredModules = this.modules.filter(mod => mod.module.toLowerCase().includes(this.searchString.toLowerCase()) || mod.name.toLowerCase().includes(this.searchString.toLowerCase()) || this.searchString.toLowerCase().includes(mod.name.toLowerCase()) || mod.module.includes(this.modules.filter(mod => this.searchString.toLowerCase().includes(mod.name.toLowerCase())).map(mod => mod.module)[0]));
      prefilteredModules = prefilteredModules.filter(mod => !(JSON.parse(localStorage.getItem('user')).currentModules.map(mod => mod.name).includes(mod.name)))
      return prefilteredModules
    }

  }

  //previews modulhandbuch of selected module
  replace(event) {
    this.newModule = this.modules.filter(module => module.name === event.name)[0].id
    this.newDescription = this.modules.filter(module => module.name === event.name)[0].description
    this.newModuleName = this.modules.filter(module => module.name === event.name)[0].name
    this.service.getPDF(this.newModule).subscribe((data) => {
      this.modulHandbuch = data
      //needed to force reload to trigger loading of pdf viewer
      this.showPDF ? this.showPDF = false : true;
    })
  }

  //triggers preview of new module in current timetable (displayed in red)
  showInCalendar() {
    this.timeTable.setAdditionalModule(this.newModuleName, this.newModule)
  }

}
