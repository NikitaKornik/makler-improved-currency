const activeIconPath = chrome.runtime.getManifest().icons;

const inactiveIconPath = {
  128: "images/inactive/icon-128.png",
  64: "images/inactive/icon-64.png",
  48: "images/inactive/icon-48.png",
};

function sendRefreshMessage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs[0].url.includes("https://makler.md")) {
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, "refresh");
  });
}

chrome.storage.onChanged.addListener(({ switchControl }) => {
  if (switchControl) {
    chrome.action.setIcon({
      path: switchControl.newValue === "on" ? activeIconPath : inactiveIconPath,
    });

    sendRefreshMessage();
  }
});

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.method === "POST" && /page\/?(\d+)?$/.test(details.url)) {
      sendRefreshMessage();
    }
  },
  { urls: ["*://makler.md/*"] }
);

(async function () {
  const { switchControl } =
    (await chrome.storage.sync.get("switchControl")) || "on";

  chrome.storage.sync.set({ switchControl });

  chrome.action.setIcon({
    path: switchControl === "on" ? activeIconPath : inactiveIconPath,
  });
})();
