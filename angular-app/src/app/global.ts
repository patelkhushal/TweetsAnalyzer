import { Injectable } from '@angular/core';

@Injectable()
export class Global {
  port = 8000;
  selected_topics = new Set();
}