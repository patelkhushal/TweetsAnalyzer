import { Component, OnInit } from '@angular/core';
import { Global } from '../global'
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValue } from '@angular/common';


@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

  screen_name
  user_profile
  fresh
  received
  constructor(private global: Global, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.fresh = false
    this.received = false
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {

      if (params.get("screen_name")) {
        this.screen_name = params.get("screen_name")
        console.log(this.screen_name)

        let url = "http://localhost:" + this.global.port + "/generateProfile" + "?" + "screen_name=" + this.screen_name
        this.http.get(url, { withCredentials: true }).subscribe(data => {
          this.user_profile = data
          console.log(data)
          console.log(this.user_profile[0]["request"])
          if (this.user_profile[0]["request"]) {
            console.log("in")
            this.router.navigate(['/user-profile'], { queryParams: { "name": this.screen_name } })
          }


        });
      }
      else {
        this.fresh = true
      }
    });
  }

  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    // console.log("in")
    return 0;
  }

}
