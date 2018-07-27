# Angular quickstart tutorial
by Karol Horosin

This is an instruction for introductory angular workshop. Things presented in points where explained in detail by me during the workshop but this barebones version might be useful for you too.

Folder `github-browser` includes final application code.

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
The name of the app will be github-browser. Go to it's folder.

```
ng new github-browser
cd github-browser
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

Go to `src/app/app.component.html`

And leave only the title here. Notice the curly braces. This syntax allows us to render contents of variables. Go to `app.component.ts` in the same directory. You can modify the title here.

When you save the files, development server you started with `ng serve` rebuilds the app and refreshed browser window.

## First component

Let's create the directory and generate first component.
```
mkdir src/app/components
ng g component components/repo
```

To use generated component, go to `app.component.html` and paste `<app-repo></app-repo>` somwhere in the bottom. In the browser you should see the text:

```
repo works!
```
in a place you pasted it.

Let's now look at src/app/components/repo and investigate its contents. 

Let's look at repo.component.ts. You can see the definition of selector we used - `selector: 'app-repo'`. Try to console log in constructor and on init to see that they're running.
e.g.
```ts
console.log("I'm in contructor");
```

When you open dev tools in your browser, you should be able to see messages you logged.

### Actually using the component

Okay, now we can add some variables to our RepoComponent class:

```ts
  name;
  watchers_count;
  open_issues;
  url;
```

Let's try to give them some values in constructor or in class body. Once again, we can reference class fields using `this` keyword, e.g. `this.name`. Then we can display them in repo.component.html

```html
<h2>Repository: {{name}}</h2>

<h3>General info</h3>
<ul>
  <li>Watchers: {{watchers}}</li>
  <li>Issues: {{issues}}</li>
  <li>Url: {{url}}</li>
</ul>
```

Usually, things have types in TypeScript (or we want them to), so let's add them.

```ts
  name:string;
  watchers_count:number;
  open_issues:number;
  url:string;
```

We can play around assigning contents with wrong types to see what happens.

Say we want to also present information about some branches in this component. Let's add another property.

```ts
  branches:string[];
```

This representation means we want to store an array of things. But how to display it?

That's where `directives` come to play. Here's is an example of standard `ngFor` directive.

```html
<h3>Branches</h3>
<ul>
  <li *ngFor="let branch of branches; let i = index">{{i}}: {{branch}}</li>
</ul>
```


## What about something dynamic?

One of the angular's greatest features is how easy it is to make things react to users input.

### Simple input

Let's add a button somewhere in our repo component.
```html
<button (click)="onClick()">Create</button>
```

And now create a function that responds to click.

```ts
  onClick() {
    console.log("Button clicked");
  }
```

That's how we handle events in Angular.

We can try to use this information. Add an input and modify the button.

```html
<input #input type="text">
<button (click)="onClick(input.value)">Create</button>
```

You can now change the onClick function and log the received value. You can then append it to the array and see what happens in the app.

```ts
  onClick(branch:string) {
    console.log("Button clicked");
    this.branches.push(branch);
  }
```

### Data binding
Import new module in app.module.ts:

```ts
import { FormsModule } from '@angular/forms';
```

And add it to import section.

```ts
@NgModule({
  declarations: [
    AppComponent,
    RepoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now let's add new input, that's going to use ngModel to map name of the repository to it's value.

```
<h3>Edit repo name</h3>
<input [(ngModel)]="name" type="text">
```

Now play around. Cool, huh?


## Fetching data from APIs

Let's try something more "real"

### Create new component

```
ng g component components/repolist
```

And include it in your app.component.html

```html
<app-repolist></app-repolist>
```

### Create a service
```
mkdir src/app/services
ng g service github
```

In previous version of angular you were supposed to specify it in providers, now it's available everywhere.

Import it in component we want to use it in. (repolist.component.ts)

```ts
import { GithubService } from '../../services/github.service';
```

Services in angular are injectables, which means you can add them to a component in a following fashion:

```ts
constructor(private github: GithubService)
```

Do it in RepoListComponent.

### Get something using service

We're going to use angular's HttpClient, a built in angular module. [docs](https://angular.io/guide/http)

In app.module.ts
```ts
import { HttpClientModule } from '@angular/common/http';
```

And add it to imports
```ts
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
```

Then in github.service
```ts
import { HttpClient } from '@angular/common/http';
```

HttpClient is also an injectable, so we inject in our service's constructor.
```ts
constructor(private http: HttpClient)
```

### Function to actually load something

Let's load repositories from angular team.

```ts
  getRepos() {
    this.http.get('https://api.github.com/users/angular/repos')
      .subscribe(repos => console.log(repos));
  }
```

We can now call it in component and see if we can fetch information correctly.
```ts
this.github.getRepos()
```

Okay, if it works, let's actually return something. We don't need to print anything.
```ts
  getRepos() {
    return this.http.get('https://api.github.com/users/angular/repos');
  }
```

### Let's unpack this data in component

In RepoListComponent (ts), create model for data. You can do it below or over the class code.
```ts
interface Repo {
  name:string;
  watchers_count:number;
  url:string;
  open_issues:number;
}
```

Add variable to the component:

```ts
  repos:Repo[];
```

And load data in ngOnInit.

```ts
  ngOnInit() {
    this.title = 'List';

    this.github.getRepos()
      .subscribe((repos:Repo[]) => {
        this.repos = repos;
      });

  }
```

Then in repolist.component.html, we should display this information:

```html
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

In app.module.ts:

```ts
import { RouterModule, Routes } from '@angular/router';
```

### Routes

Define routes
```ts
const appRoutes:Routes = [
  {path:'', component:RepoComponent},
  {path:'list', component:RepolistComponent}
];
```

And the following expression to imports.
```ts
RouterModule.forRoot(appRoutes)
```

### Router output

Now let's make router present something. In app.component.html put following instead of our component tags.
```html
<router-outlet></router-outlet>
```

Try it out by going to
localhost:4200
localhost:4200/list

### Links
We can also create links to go to our specified paths. You can add them above the router outlet.
```html
<ul>
  <li><a routerLink="/">Home</a></li>
  <li><a routerLink="/list">List</a></li>
</ul>
```

## That's it, you created a basic app!

## Extra
You can try out some new features of angular cli.
```
ng generate @angular/material:material-nav --name=my-nav

```