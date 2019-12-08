import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import {Global} from '../global'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user_profiles
  constructor(private route: ActivatedRoute, private http: HttpClient, private global: Global, private router: Router) { }

  ngOnInit() {

    let url = "http://localhost:" + this.global.port + "/random"
    this.http.get(url, {withCredentials: true }).subscribe(data => { //{headers: {'credentials':'same-origin'}}
      this.user_profiles = data
      console.log(this.user_profiles)
      console.log(typeof(this.user_profiles[0].hashtags))
    });
  }

}
