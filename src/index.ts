import {debounceTime, from, fromEvent, map, mergeMap, switchMap} from "rxjs";
import {combineLatest} from "rxjs/operators";
import {ajax} from "rxjs/ajax";


const textInput$: any = document.getElementById("user");
const avatar$: any = document.getElementById("avatar");
const login$: any = document.getElementById("login");
const name$: any = document.getElementById("name");
const place$: any = document.getElementById("place");
const desc$: any = document.getElementById("desc");
const company$: any = document.getElementById("company");
const twitter$: any = document.getElementById("twitter");
const followers$: any = document.getElementById("follower");
const following$: any = document.getElementById("following");
const publicrepos$: any = document.getElementById("publicrepos");

const input$ = fromEvent(textInput$, "input")
input$.pipe(
    debounceTime(1000),
    switchMap((event: any) => {
        const term = event.target.value;
        return ajax.getJSON(`https://api.github.com/users/${term}`)
    })).subscribe((val: any) => {
        avatar$.src = val.avatar_url;
        login$.innerHTML = val.login;
        name$.innerHTML = val.name;
        place$.innerHTML = val.location;
        desc$.innerHTML = val.bio;
        company$.innerHTML = val.company;
        twitter$.innerHTML = `@${val.twitter_username}`;
        twitter$.href = `https://twitter.com/${val.twitter_username}`;
        followers$.innerHTML = `Followers: ${val.followers}`;
        following$.innerHTML = val.following;
        publicrepos$.innerHTML = val.public_repos;
    }
);
