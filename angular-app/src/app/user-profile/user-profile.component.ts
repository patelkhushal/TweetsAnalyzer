import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import {Global} from '../global'
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  id
  screen_name
  user_profile_json_array
  constructor(private route: ActivatedRoute, private http: HttpClient, private global: Global, private router: Router) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get("id")
      this.screen_name = params.get("name")

      let url
      if(this.id){
        url = "http://localhost:" + this.global.port + "/getUser?id=" + this.id;
      }
      else{
        url = "http://localhost:" + this.global.port + "/getUser?name=" + this.screen_name;
      }
        this.http.get(url, {withCredentials: true }).subscribe(data => {
          console.log(data)
          this.user_profile_json_array = JSON.parse(JSON.stringify(data))
        });
    });
  }

    // Preserve original property order
    originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
      // console.log("in")
      return 0;
    }

}
