import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { Global } from '../global'
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user_profiles
  mode
  selected_topics

  constructor(private route: ActivatedRoute, private http: HttpClient, private global: Global, private router: Router) { }

  ngOnInit() {
    this.selected_topics = this.global.selected_topics
    this.mode = this.global.mode
    let url = "http://localhost:" + this.global.port + "/random"
    this.http.get(url, { withCredentials: true }).subscribe(data => { //{headers: {'credentials':'same-origin'}}
      this.user_profiles = data
    });
  }

  detailedUserProfile(id) {
    this.router.navigate(['/user-profile'], { queryParams: { "id": id } })
  }
  // Preserve original property order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
