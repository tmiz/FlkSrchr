// Save this script as `options.js`

function update_status(str) {
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = str;
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Saves options to localStorage.
function save_options(storageName, elementId) {
  var select = document.getElementById(elementId);
  var sort = select.children[select.selectedIndex].value;
  localStorage[storageName] = sort;
}

// Restores select box state to saved value from localStorage.
function restore_options(storageName, elementId) {
  var favorite = localStorage[storageName];
  if (!favorite) {
    return;
  }
  var select = document.getElementById(elementId);
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
}

function restore_all_options() {
  restore_options("favorite_sort", "sort");
  restore_options("page_num", "page_num");
  restore_options("click_action","click_action");
  restore_options("image_size","image_size");

  if (localStorage["tag"]) {
    document.getElementById("tag").value = localStorage["tag"];
  }
  if (localStorage["user_id"]) {
    document.getElementById("user_id").value = localStorage["user_id"];
  }
  if (localStorage["text"]) {
    document.getElementById("text").value = localStorage["text"];
  }
}

function save_all_options() {
  save_options("favorite_sort", "sort");
  save_options("page_num", "page_num");
  save_options("click_action", "click_action");
  save_options("image_size", "image_size");



  localStorage["tag"] = document.getElementById("tag").value;
  localStorage["user_id"] = document.getElementById("user_id").value;
  localStorage["text"] = document.getElementById("text").value;

  update_status("setting saved");
  var bg = chrome.extension.getBackgroundPage().bg;
  bg.getContents();
}

document.addEventListener('DOMContentLoaded', restore_all_options);
document.querySelector('#save').addEventListener('click', save_all_options);