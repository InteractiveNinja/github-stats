import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.css";
import { debounceTime, fromEvent, map } from "rxjs";
import $ from "jquery";


type REPO_API = { name: string; url: string; language: string };
type USER_API = {
  name: string;
  bio: string;
  followers: number;
  location: string;
  avatar_url: string;
  following: number;
  public_repos: number;
  twitter_username: string;
};

const inputbar = $("#username");

const input$ = fromEvent(inputbar, "input");

const createCard = (
  {
    name,
    bio,
    followers,
    location,
    avatar_url,
    following,
    public_repos,
    twitter_username,
  }: USER_API,
  USER_REPOS: REPO_API
) => {
  $("#git-card").show();
  if (name) $("#git-name").text(name);
  if (bio) $("#git-bio").text(bio);
  if (followers) $("#git-follower").text(followers);
  if (location) $("#git-location").text(location);
  if (avatar_url) $("#git-pic").attr("src", avatar_url);
  if (following) $("#git-follows").text(following);
  if (public_repos) $("#git-repos").text(public_repos);
  if (twitter_username) $("#git-twitter").text(`@${twitter_username}`);

  for (let i = 0; i < 5; i++) {
    let html = createRepoCard(USER_REPOS[i]);
    $("#git-repos-list").append(html);
  }
};

const createRepoCard = ({ language, name, url }: REPO_API) => {
  if (!language || !name || !url) return "";
  return ` <div class="border border-2 rounded rounded-2 p-3 m-2 text-center">
                        <p class="fs-4">${name}</p>
                        <p class="fs-4">${language}</p>
                        <a class="fs-4" href="${url}"><i class="bi bi-github"></i></a>
                    </div>`;
};

input$
  .pipe(
    debounceTime(200),
    // @ts-ignore
    map((e) => e.target?.value)
  )
  .subscribe(() =>
    createCard(USER_DATA as USER_API, USER_REPOS as unknown as REPO_API)
  );
