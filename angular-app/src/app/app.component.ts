import { Component, OnInit } from '@angular/core';
import { Global } from './global'
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'angular-app';
  search_input
  topics_query
  mode
  constructor(private global: Global, private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  submit_button_clicked(mode_set) {
    if(this.global.mode == 'user'){
      if (this.search_input.length > 1) {
        let screen_name = this.search_input
        this.global.user_mode_user = screen_name
        this.search_input = ""
        this.router.navigate(['/user-profile'], { queryParams: { "name": screen_name } })
      }
    }
    else {
      if (this.search_input.length > 1) {
        mode_set.add(this.search_input)
        this.search_input = ""
  
        this.topics_query = this.global.mode + "="
        mode_set.forEach(element => {
          this.topics_query += "&" + this.global.mode + "=" + element
        });
        this.router.navigate(['/query-profiles'], { queryParams: { "param": Array.from(mode_set).join(' ') } })
      }
    }
  }

  delete_topic(topic, mode_set) {
    mode_set.delete(topic)
    if(mode_set.size >= 1){
      this.topics_query = "topics="
      mode_set.forEach(element => {
      this.topics_query += "&topics=" + element
    });
    this.router.navigate(['/query-profiles'], { queryParams: { "param": Array.from(mode_set).join(' ') } })
    }
    else{
      this.router.navigate(['/home'])
    }
  }

  changeMode(mode, mode_set) {
    this.global.mode = mode
    if(mode == 'user'){
      if(this.global.user_mode_user){
        this.router.navigate(['/user-profile'], { queryParams: { "name": this.global.user_mode_user } })
      }
    }
    else {
      if(mode_set && mode_set.size >= 1){
        this.router.navigate(['/query-profiles'], { queryParams: { "param": Array.from(mode_set).join(' ') } })
      }
      else if(mode_set.size == 0){
        this.router.navigate(['/home'])
      }
    }
    
  }

}
