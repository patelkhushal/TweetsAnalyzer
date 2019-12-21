import { Injectable } from '@angular/core';

@Injectable()
export class Global {
  port = 8000;
  selected_topics = new Set();
  selected_hashtags = new Set();
  mode = "topics"
  user_mode_user
  generate
  generated_user_profile
}