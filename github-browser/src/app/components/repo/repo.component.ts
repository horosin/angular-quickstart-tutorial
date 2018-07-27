import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repo',
  templateUrl: './repo.component.html',
  styleUrls: ['./repo.component.css']
})
export class RepoComponent implements OnInit {

  name:string;
  watchers_count:number;
  open_issues:number;
  url:string;
  branches:string[];

  constructor() { 
    console.log("I'm in contructor");

    this.name = "My best repository";
    this.watchers_count = 10;
    this.open_issues = 6;
    this.url = "http://github.com";

    this.branches = [
      "master",
      "develop",
      "feature-awesome"
    ]

  }

  ngOnInit() {
    console.log("I'm in ngOnInit");
  }

  onClick(branch:string) {
    console.log("Button clicked");
    this.branches.push(branch);
  }

}
