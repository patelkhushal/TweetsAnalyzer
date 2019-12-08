import { Component, OnInit } from '@angular/core';
import { Global } from './global'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-app';

  selected_topics
  search_input
  mode
  constructor(private global: Global ) { 
  }

  ngOnInit() {
    this.selected_topics = this.global.selected_topics
    this.mode = this.global.mode
  }

  submit_button_clicked(){
    if(this.search_input.length > 1){
      this.selected_topics.add(this.search_input)
      this.search_input = ""
    }
  }

  delete_topic(topic){
    this.selected_topics.delete(topic)
  }

  changeMode(mode){
    this.global.mode = mode
    this.mode = mode
  }

}
