import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../models/user";

@Component({
  selector: 'chirp-user',
  templateUrl: './chirp-user.component.html',
  styleUrls: ['./chirp-user.component.scss'],
})
export class ChirpUserComponent implements OnInit {

  @Input() user: User | undefined;
  @Input() isPublic: boolean = false;
  @Output() removeUserFromReaders: any = new EventEmitter<User>();
  @Output() addUserToReaders: any = new EventEmitter<User>();
  @Output() removeUserFromWriters: any = new EventEmitter<User>();
  @Output() addUserToWriters: any = new EventEmitter<User>();

  @Input() readerUsers: User[] = [];
  @Input() writerUsers: User[] = [];

  addToReadersToggle: boolean = false;
  addToWritersToggle: boolean = false;


  constructor() {
  }

  ngOnInit() {
  }

  removeUserFromReadersList(user: User) {
    this.removeUserFromReaders.emit(user);
  }

  handleAddToReadersToggle() {
    this.addToReadersToggle = this.existsInReaders();
    this.addToReadersToggle ? this.removeUserFromReadersList(this.user!) : this.addUserToReadersList(this.user!);
    this.addToReadersToggle = !this.addToReadersToggle;
  }

  handleAddToWritersToggle() {
    this.addToWritersToggle = this.existsInWriters();
    this.addToWritersToggle ? this.removeUserFromWriterList(this.user!) : this.addUserToWritersList(this.user!);
    this.addToWritersToggle = !this.addToWritersToggle;
  }

  addUserToReadersList(user: User) {

    this.addUserToReaders.emit(user);
  }

  removeUserFromWriterList(user: User) {
    this.removeUserFromWriters.emit(user);
  }

  addUserToWritersList(user: User) {
    this.addUserToWriters.emit(user);
  }


  existsInReaders() {
    return this.readerUsers.map(user => user.email).includes(this.user!.email);
  }

  existsInWriters() {
    return this.writerUsers.map(user => user.email).includes(this.user!.email);
  }

}
