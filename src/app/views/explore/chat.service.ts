import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

// Mock KI / Chatbot service

@Injectable()
export class ChatService {
  public readonly responses: Subject<string> = new Subject<string>();
  public searchString = "";

  public submit(question: string): void {
    const length = question.length;
    let answer = ""
    switch (question) {
      case "Empfehlen":
        answer = "Ich habe dir deine Modulempfehlunge in der Liste ausgewählt"
        this.searchString = "SW"
        break;
      case "Modulsuche!":
        answer = "Für was interessierst du dich?"
        break;
      case "Hilfe!":
        answer = "Mögliche Befehle: Modulsuche | Empfehlen?"
        break;
      default:
        answer = "Meine Empfehlungen für dich kannst du dir in der Liste anschauen"
        this.searchString = "Data"
    }
    setTimeout(
      () => this.responses.next(answer),
      700
    );
  }
}
