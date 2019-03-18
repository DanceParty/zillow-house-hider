let lastHash = "";

window.setInterval(function() {
  let newHash = location.href;
  // trigger dom update when new url (url changes based on lat/long)
  if (newHash !== lastHash) {
    app();
    lastHash = newHash;
  }
}, 2000);

function app() {
  const thumbnails = [
    ...document.getElementsByClassName("zsg-photo-card-actions")
  ];

  thumbnails.forEach(thumbnail => {
    const houseId = thumbnail.firstChild.dataset.fmZpid;

    // remove all hidden houses from DOM
    storageGet(houseIdObj => {
      console.log(Object.keys(houseIdObj));
      if (Object.keys(houseIdObj).includes(houseId)) {
        removeHouseFromDOM(thumbnail);
      }
    });

    // add hidden button to visible houses
    thumbnail.appendChild(createHideButton(houseId, thumbnail));
  });
}

/*
  Given the dom object of the actions bar for each house thumbnail,
  remove the entire thumbnail for that given house
*/
function removeHouseFromDOM(thumbnailDOM) {
  const houseListItem = thumbnailDOM.parentNode.parentNode.parentNode;
  const houseList = houseListItem.parentNode;
  houseList.removeChild(houseListItem);
}

/*
  Create a hide house button
*/
function createHideButton(houseId, thumbnailDOM) {
  const hideButton = document.createElement("a");
  hideButton.appendChild(document.createTextNode("❌"));
  hideButton.onclick = onClick(houseId, thumbnailDOM);
  return hideButton;
}

function onClick(houseId, thumbnailDOM) {
  return function(e) {
    storageSet(houseId, true);
    removeHouseFromDOM(thumbnailDOM);
  };
}

/*
  Fetch data from chrome storage
*/
function storageGet(callback) {
  chrome.storage.sync.get(["zillowHouseHide"], result => {
    console.log(result);
    callback(result.zillowHouseHide);
  });
}

/*
  Update data in chrome storage
*/
function storageSet(key, value) {
  chrome.storage.sync.get(["zillowHouseHide"], result => {
    console.log("test:", result.zillowHouseHide);
    chrome.storage.sync.set({
      zillowHouseHide: {
        ...result.zillowHouseHide,
        [key]: value
      }
    });
  });
}
