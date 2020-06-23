import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  uri = "http://localhost:4000"
  task;

  constructor(private httpClient: HttpClient) {
  }

  getICAL(id) {
    return this.httpClient.get(`${this.uri}/ical?id=${id}`, {responseType: 'text'});
  }

  getSuggestions(id) {
    return this.httpClient.get(`${this.uri}/getSuggestions?id=${id}`, {observe: 'response', responseType: 'text'});
  }

  getICALModule(id) {
    return this.httpClient.get(`${this.uri}/geticalmodule?id=${id}`, {responseType: 'text'});
  }

  getModules() {
    return this.httpClient.get(`${this.uri}/getModules`);
  }

  getUserData(id) {
    return this.httpClient.get(`${this.uri}/getUserData?id=${id}`, {responseType: 'text'});
  }

  login(id, hash) {
    return this.httpClient.post(`${this.uri}/login`, {id: id, hash: hash}, {observe: 'response', responseType: 'text'});
  }

  pushApplication(id, moduleId) {
    return this.httpClient.post(`${this.uri}/apply`, {id: id, moduleId: moduleId}, {observe: 'response', responseType: 'text'});
  }

  getPDF(id) {
    return this.httpClient.get(`${this.uri}/pdf?id=${id}`, {responseType: "arraybuffer"});
  }

  getApplications(id) {
    return this.httpClient.get(`${this.uri}/getApplications?id=${id}`, {observe: 'response', responseType: "text"});
  }
}
