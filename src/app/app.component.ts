import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import { Message } from 'primeng/api';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'signalr-client';
  _hubConnection: HubConnection;

  msgs: Message[] = [];
  constructor() { }

  ngOnInit(): void {
    this._hubConnection = new HubConnectionBuilder().withUrl('http://localhost:61758/notify').build();
    this.startConnection();

    this._hubConnection.on('SendSimpleMessage', (message: string) => {
      this.msgs = [];
      this.msgs.push({ severity: '', summary: message });
    });

    this._hubConnection.onclose( () => this._hubConnection.start());


  }

  private startConnection() {
    this._hubConnection
      .start()
      .then(() => { this._hubConnection.invoke('Connect', 'craig@ferretly.com'); console.log('Connection started!'); })
      .catch(err => {
        this.msgs.push( { severity: 'error', summary: 'Error while establishing connection'});
        console.log('Error while establishing connection :(');
      });
  }

  connect() {
    this.startConnection();
  }
}
