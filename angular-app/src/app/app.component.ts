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
  constructor(private global: Global ) { 
  }

  ngOnInit() {
    this.selected_topics = this.global.selected_topics
    console.log(this.selected_topics)
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

}
