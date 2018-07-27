# Angular quickstart tutorial
by Karol Horosin

This is an instruction for introductory angular workshop. Things presented in points where explained in detail by me during the workshop but this barebones version might be useful for you too.


## What you need to know
- HTML
- A little CSS
- Basic JavaScript
- Basic programming skills

## What is Angular?
- Frontend framework - for client side applications
- Created and maintained by Google (they have 600+ internal apps using it)
- Powerfull dynamic applications
- We are looking at Angular 2+ (now at 6), not to confuse with AngularJS (1.7) - very different frameworks

## Why angular
- Rapid development and code generation
- Organization of application files and logic
- Data binding (dynamic update of content)
- Test suite
- Large community support, Google begind it
- Opinionated, has standard way of doing things

## TypeScript
- Like JavaScript
- Static typing
- Java-like
- Compiles to JavaScript

## Components
- Building block of the UI
- Angular app is really a tree of components, starting at app component
- Decorators are used to define components

## Services
- Shared between components
- Used to do ajax calls
- Kind of "models"
- Letsus separate data from views

## What are we going to build?
- A simple app talking with GitHub's REST API
   [api documentation](https://developer.github.com/v3/)
- Listing of repositories
- A training subpage with one repository


## Prerequisites

### Node and npm
Node is JS runtime without the browser, used e.g. for server-side apps.

[Install guide for all systems](https://nodejs.org/en/download/package-manager/)

Ubuntu/Debian:
```
sudo apt-get install nodejs
```

Mac:
```
brew install nodejs
```

#### Angular
```
npm install -g @angular/cli
```

### Optionally Angular plugin for your editor
Recommended!

## Let's start!

### Generate our app
The name of the app will be github-browser/

```
ng new github-browser
```

### Start development server
```
ng serve
```
And go to [localhost:4200](localhost:4200) to see the app running.

### File structure overview

Let's look  at what was generated.


Some of the files:
```
- package.json - node config
- angular.json - angular cli config
+ e2e - end to end testing
+ node_modules - dependencies
+ src - source of our app
```

You can generally notice a lot of *.ts files. These are TypeScipt code files.

## Modifying app component

Let's leave only the title here.

## First component

Let's create the directory and generate first component.
```
mkdir src/app/components
ng g component components/repo
```

We can look into src/app/components/repo and investigate its contents.

Let's look at repo.component.ts and console log to constructor and on init to see that they're running/
e.g.
```
console.log("I'm in contructor");
```

Okay, now we can add some variables to our RepoComponent class:

```
  name;
  watchers_count;
  open_issues;
  url;
```

Let's try to give them some values in constructor or in class body. Once again, we can reference class fields using `this` keyword, e.g. `this.name`. Then we can display them in repo.component.html

```
<h2>Repository: {{name}}</h2>

<h3>General info</h3>
<ul>
  <li>Watchers: {{watchers}}</li>
  <li>Issues: {{issues}}</li>
  <li>Url: {{url}}</li>
</ul>
```

Usually, things have types in TypeScript, so let's add them.

```
  name:string;
  watchers_count:number;
  open_issues:number;
  url:string;
```

We can play around assigning contents with wrong types to see what happens.

Say we want to also present information about some branches in this component. Let's add another property.

```
  branches:string[];
```

This representation means we want to store an array of things. But how to display it?

That's where `directives` come to play.

```
<h3>Branches</h3>
<ul>
  <li *ngFor="let branch of branches; let i = index">{{i}}: {{branch}}</li>
</ul>
```


## What about something dynamic?

### Simple input

Let's add a button somewhere in our repo component.
```
<button (click)="onClick()">Create</button>
```

And now create a function that responds to click.

```
  onClick() {
    console.log("Button clicked");
  }
```

That's how we handle events in Angular.

We can try to use this information. Add an input and modify the button.

```
<input #input type="text">
<button (click)="onClick(input.value)">Create</button>
```

You can now change the onClick function and log the received value. You can then append it to the array and see what happens in the app.

### Data binding
Import new module

```
import { FormsModule } from '@angular/forms';
```

And add it to import section.

Now let's add new input, that's going to use ngModel to map name of the repository to it's value.

```
<h3>Edit repo name</h3>
<input [(ngModel)]="name" type="text">
```

Now play around. Cool, huh?


## Fetching data from APIs

### Create new component

```
ng g component components/repolist
```

### Create a service
```
mkdir src/app/services
ng g service services/github
```

In previous version of angular you were supposed to specify it in providers, now it's available everywhere.

Import it in component we want to use it in. (repolist.component.ts)

```
import { GithubService } from '../../services/github.service';

```

### Get something using service

We're going to use angular's HttpClient, a built in angular module. [docs](https://angular.io/guide/http)

In app.module.ts
```
import { HttpClientModule } from '@angular/common/http';
```

And add it to imports
```
  imports: [
    BrowserModule,
    HttpClientModule
  ],
```

Then in github.service
```
import { HttpClient } from '@angular/common/http';
```

HttpClient is also an injectable, so we inject in our service's constructor.
```
constructor(private http: HttpClient)
```

### Function to actually load something

```
  getRepos() {
    this.http.get('https://api.github.com/users/angular/repos')
      .subscribe(repos => console.log(repos));
  }
```

We can now call it in component and see if we can fetch information correctly.
```
this.github.getRepos()
```

Okay, if it works, let's actually return something. We don't need to print anything.
```
  getRepos() {
    return this.http.get('https://api.github.com/users/angular/repos');
  }
```

### Let's unpack this data in component

Create model for data:
```
interface Repo {
  name:string;
  watchers_count:number;
  url:string;
  open_issues:number;
}
```

Load data in ngOnInit

```
  ngOnInit() {
    this.title = 'List';

    this.github.getRepos()
      .subscribe((repos:Repo[]) => {
        this.repos = repos;
      });

  }
```

Then in repolist.component.html, we should display this information:

```
<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Name</th>
            <th>Url</th>
            <th>Whatchers</th>
            <th>Issues</th>
        </tr>
    </thead>
    <tbody>
        <tr *ngFor="let repo of repos; let i = index">
            <td>{{i}}</td>
            <td>{{repo.name}}</td>
            <td>{{repo.url}}</td>
            <td>{{repo.watchers_count}}</td>
            <td>{{repo.open_issues}}</td>
        </tr>
        
    </tbody>
</table>
```

## Router
To actually differentiate something in our app, let's try to add some navigation. We have two components and we can use them as a kind of subpages. This is where another built-in angular module comes in - Router.


```
import { RouterModule, Routes } from '@angular/router';
```

### Routes

Define routes
```
const appRoutes:Routes = [
  {path:'', component:RepoComponent},
  {path:'list', component:RepolistComponent}
];
```

And the to imports
```
RouterModule.forRoot(appRoutes)
```

### Router output

Then in app.component.html
```
<router-outlet></router-outlet>
```

Try it out by going to
localhost:4200
localhost:4200/list

### Links
We can now create links to go to our specified paths.
```
<ul>
  <li><a routerLink="/">Home</a></li>
  <li><a routerLink="/list">List</a></li>
</ul>
```

## Extra
```
ng generate @angular/material:material-nav --name=my-nav

```

## That's it, you created a basic app!