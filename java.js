var redirect = "https://localhost:8888/logged";

var client_id = "bd980123ae644143aff9a0db5495efc1";
var client_secret = "d8ffae6c29a34e378733a0e7a55ba593";

const AUTHORIZE = "https://accounts.spotify.com/authorize";

const TOKEN = "https://accounts.spotify.com/api/token";
const ARTISTS = "https://api.spotify.com/v1/mm/me/top/artists?offset=0&limit=10&time_range=long_term";
const TRACKS = "https://api.spotify.com/v1/me/top/tracks?offset=0&limit=10&time_range=long_term";

const list = document.getElementById("list");
const cover = document.getElementById("cover");
cover.classList.add("hide");

function authorize() {
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-playback-state user-top-read";
    window.location.href = url;
}

function onPageLoad() {
    if (window.location.search.length > 0) {
        handleRedirect();
    } else {
        getSongs();
    }
}

function handleRedirect() {
    let code = getCode();
    fetchAccessToken(code);
    window.history.pushState("", "", redirect);
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get("code");
    }
    return code;
}

function fetchAccessToken(code){
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthApi(body);
}

function callAuthApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthResponse;
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token"); 
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthApi(body);
}

function handleAuthResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.access_token != undefined){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function getSongs(){
    access_token = localStorage.getItem("access_token");
    if (access_token == null){
        alert("You are not logged in");
        window.location.href = "index-3(1).html";
    }
    callApi("GET", TRACKS, null, handleSongResponse);
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("access_token"));
    xhr.send(body);
    xhr.onload = callback;
}

function handleSongResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        songList(data);
        }
    else if (this.status == 401){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function handleArtistResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);

        artistList(data);
        }
    else if (this.status == 401){
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function songList(data){
    removeItem();
    for(i=0; i<data.items.length; i++){
        const list_item = document.createElement("div");
        const list_text = document.createElement("div");
        const song = document.createElement("div");
        const artist_album = document.createElement("div");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const popu = document.createElement("div");
        const ref = document.createElement("a");
        const link = document.createElement("link to spotify");
        ref.appendChild(link);
        ref.title = "link to spotify";
        ref.href = data.items[i].external_urls.spotify;

        list_text.classList.add("list_text");
        list_item.classList.add("list_item");
        song.classList.add("song");
        artist_album.classList.add("artist_album");
        ref.classList.add("links");
        popu.classList.add("popu");
        ref.setAttribute("target", "_blank");
        img.classList.add("resize");


        list_text.appendChild(song);
        list_text.appendChild(artist_album);
        list_text.appendChild(pops);
        list_text.appendChild(ref);
        list_item.appendChild(img);
        list_item.appendChild(list_text);
        list.appendChild(list_item);

        list.appendChild(li);

    }
}

function removeItem(){
    list.innerHTML = "";
}

function getArtists(){
    callApi("GET", ARTISTS, null, handleArtistResponse);
}

function artistList(data){
    removeItem();
    callApi.classList.add("hide");
    for(i=0; i<data.items.length; i++){
        const list_item = document.createElement("div");
        const list_text = document.createElement("div");
        const artist = document.createElement("div");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const pops = document.createElement("div");
        const ref = document.createElement("a");
        const link = document.createElement("link to spotify");
        ref.appendChild(link);
        ref.title = "link to spotify";
        ref.href = data.items[i].external_urls.spotify;

        list_text.appendChild(artist);
        list_text.appendChild(pops);
        list_text.appendChild(ref);
        list_item.appendChild(img);
        list_item.appendChild(list_text);
        list.appendChild(list_item);

        list.appendChild(li);

    }



