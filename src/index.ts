import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import {
  catchError,
  debounceTime,
  empty,
  filter,
  forkJoin,
  fromEvent,
  map,
  mapTo,
  of,
  subscribeOn,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import $ from "jquery";
import { ajax } from "rxjs/ajax";

type REPO_API = { name: string; html_url: string; language: string };
type USER_API = {
  login: string;
  name: string;
  bio: string;
  followers: number;
  location: string;
  avatar_url: string;
  following: number;
  public_repos: number;
  twitter_username: string;
};

const createCard = (
  {
    login,
    name,
    bio,
    followers,
    location,
    avatar_url,
    following,
    public_repos,
    twitter_username,
  }: USER_API,
  USER_REPOS: REPO_API[]
) => {
  clearFields();
  $("#git-card").show();
  !name ? $("#git-name").text(login) : $("#git-name").text(name);
  if (bio) $("#git-bio").text(bio);
  if (followers) $("#git-follower").text(followers);
  if (location)
    $("#git-location").html(
      '<i class="bi bi-geo-alt text-danger"></i>' + location
    );
  if (avatar_url) $("#git-pic").attr("src", avatar_url);
  if (following) $("#git-follows").text(following);
  if (public_repos) $("#git-repos").text(public_repos);
  if (twitter_username) {
    $("#git-twitter").html(
      `<i class="bi bi-twitter text-primary"></i> @${twitter_username}`
    );
    $("#git-twitter").attr("href", `https://twitter.com/${twitter_username}`);
  }

  if (USER_REPOS.length >= 3) {
    for (let i = 0; i < 3; i++) {
      const entry = USER_REPOS[i];
      if (!entry.html_url || !entry.name || !entry.language) continue;
      const html = createRepoCard(USER_REPOS[i]);
      $("#git-repos-list").append(html);
    }
  }
};

const clearFields = () => {
  $("#git-name").text("");
  $("#git-bio").text("");
  $("#git-follower").text("");
  $("#git-location").text("");
  $("#git-pic").attr("src", "");
  $("#git-follows").text("");
  $("#git-repos").text("");
  $("#git-twitter").text("");
  $("#git-twitter").attr("href", "");
  $("#git-repos-list").html("");
};

const createRepoCard = ({ language, name, html_url }: REPO_API) => {
  return ` <div class="border border-2 rounded rounded-2 p-3 m-2 text-center">
                        <p class="fs-4">${name}</p>
                        <p class="fs-4">${language}</p>
                        <a class="fs-4" target="_blank" href="${html_url}"><i class="bi bi-github"></i></a>
                    </div>`;
};

const input$ = fromEvent($("#username"), "input");
input$
  .pipe(
    debounceTime(1000),
    map((m) => (<HTMLInputElement>m.target).value),
    filter((f) => f != ""),
    switchMap((name) => {
      return forkJoin({
        user: ajax.getJSON(`https://api.github.com/users/${name}`).pipe(
          catchError((error) => {
            return of("error");
          })
        ),
        repo: ajax.getJSON(`https://api.github.com/users/${name}/repos`).pipe(
          catchError((error) => {
            return of("error");
          })
        ),
      });
    })
  )
  .subscribe((val) => {
    if (val.repo == "error" || val.user == "error")
      return alert("User nicht gefunden");
    createCard(<USER_API>val.user, <REPO_API[]>val.repo);
  });
// .subscribe(console.log);
