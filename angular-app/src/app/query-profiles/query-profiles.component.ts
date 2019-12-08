import { Component, OnInit } from '@angular/core';
import { Global } from '../global'
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-query-profiles',
  templateUrl: './query-profiles.component.html',
  styleUrls: ['./query-profiles.component.css']
})
export class QueryProfilesComponent implements OnInit {

  topics_query
  user_profiles
  query_param
  constructor(private global: Global, private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.topics_query = this.global.mode + "="
      this.global.selected_topics.forEach(element => {
        this.topics_query += "&" + this.global.mode + "=" + element
      });
      this.query_param = params.get("param").split(" ")
      this.query_param.forEach(element => {
        this.topics_query += "&" + this.global.mode + "=" + element
      });

      let url = "http://localhost:" + this.global.port + "/" + this.global.mode + "?" + this.topics_query
      this.http.get(url, { withCredentials: true }).subscribe(data => { //{headers: {'credentials':'same-origin'}}
        this.user_profiles = data
      });
    });
  }

  detailedUserProfile(id) {
    this.router.navigate(['/user-profile'], { queryParams: { "id": id } })
  }
  // Preserve original property order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    // console.log("in")
    return 0;
  }

}
