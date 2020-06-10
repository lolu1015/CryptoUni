import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  uri = "http://localhost:4000"
  task;
  plants = [];

  constructor(private httpClient: HttpClient) {
  }

  getICAL(id) {
    return this.httpClient.post(`${this.uri}/getical`, {name: id}, {responseType: 'text'});
  }

  getICALModule(id, name) {
    return this.httpClient.post(`${this.uri}/geticalmodule`, {name: id, additional: name}, {responseType: 'text'});
  }

  login(id, hash) {
    return this.httpClient.post(`${this.uri}/login`, {name: id, hash: hash}, {observe: 'response', responseType: 'text'});
  }
}
