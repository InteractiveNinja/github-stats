import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { debounceTime, fromEvent, switchMap } from "rxjs";
import $ from "jquery";
import { ajax } from "rxjs/ajax";

type REPO_API = { name: string; url: string; language: string };
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

const createCard = ({
  login,
  name,
  bio,
  followers,
  location,
  avatar_url,
  following,
  public_repos,
  twitter_username,
}: USER_API) =>
  // USER_REPOS: REPO_API
  {
    clearFields();
    $("#git-card").show();
    !name ? $("#git-name").text(login) : $("#git-name").text(name);
    if (bio) $("#git-bio").text(bio);
    if (followers) $("#git-follower").text(followers);
    if (location) $("#git-location").text(location);
    if (avatar_url) $("#git-pic").attr("src", avatar_url);
    if (following) $("#git-follows").text(following);
    if (public_repos) $("#git-repos").text(public_repos);
    if (twitter_username) $("#git-twitter").text(`@${twitter_username}`);

    //Wird erst gebraucht wenn Repos supportet werden
    // for (let i = 0; i < 5; i++) {
    //     let html = createRepoCard(USER_REPOS[i]);
    //     $("#git-repos-list").append(html);
    // }
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
};

const createRepoCard = ({ language, name, url }: REPO_API) => {
  if (!language || !name || !url) return "";
  return ` <div class="border border-2 rounded rounded-2 p-3 m-2 text-center">
                        <p class="fs-4">${name}</p>
                        <p class="fs-4">${language}</p>
                        <a class="fs-4" href="${url}"><i class="bi bi-github"></i></a>
                    </div>`;
};

const input$ = fromEvent($("#username"), "input");
input$
  .pipe(
    debounceTime(1000),
    switchMap((event: any) => {
      const term = event.target.value;
      return ajax.getJSON(`https://api.github.com/users/${term}`);
    })
  )
  .subscribe((val) => createCard(<USER_API>val));
