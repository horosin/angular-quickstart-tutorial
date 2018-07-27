import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-repolist',
  templateUrl: './repolist.component.html',
  styleUrls: ['./repolist.component.css']
})
export class RepolistComponent implements OnInit {

  repos:Repo[];

  constructor(private github: GithubService) {
    this.github.getRepos()

  }

  ngOnInit() {

    this.github.getRepos()
      .subscribe((repos:Repo[]) => {
        this.repos = repos;
      });

  }

}

interface Repo {
  name:string;
  watchers_count:number;
  url:string;
  open_issues:number;
}