"use strict";

var clickCount = 0;
var selectedColor = 'black';

window.onload = function init() {
    console.log("PAGE LOADED!");

    document.getElementById("changeColor").addEventListener("click", changeTextColor);
    
    let droplist = document.getElementById("colors");
    droplist.getElementsByTagName("option")[0].selected = "selected";
    droplist.addEventListener("change", colorSetting);

    window.addEventListener("mousemove", mouseFollow);
}

function colorSetting() {
    selectedColor = this.value;
    document.getElementById("changeColor").style.color = selectedColor;
}

function changeTextColor() {
    this.style.color = "magenta";
}

function clickMe() {
    clickCount += 1;
    console.log("YOU CLICK IT!");
    let clickLabel = document.getElementById("clickResult");
    clickLabel.innerHTML = "Ouch x" + clickCount +  "!";
}

function showName() {
    let nameLabel = document.getElementById("displayName");
    let username = document.getElementById("nameEntry");
    nameLabel.innerHTML = "Welcome, " + username.value + "!";
}

function mouseFollow(event) {
    document.getElementById("coordinates").innerHTML = event.clientX + "," + event.clientY;
}