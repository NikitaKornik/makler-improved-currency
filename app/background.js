const DEFAULT_SWITCH_CONTROL = "on";
const DEFAULT_CURRENCY = "USD";

const activeIconPath = chrome.runtime.getManifest().icons;

const inactiveIconPath = {
  128: "images/inactive/icon-128.png",
  64: "images/inactive/icon-64.png",
  48: "images/inactive/icon-48.png",
};

chrome.storage.onChanged.addListener(({ switchControl }) => {
  if (switchControl) {
    chrome.action.setIcon({
      path: switchControl.newValue === "on" ? activeIconPath : inactiveIconPath,
    });
  }
});

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.method === "POST" && /page\/?(\d+)?$/.test(details.url)) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (!tabs[0].url.includes("https://makler.md")) {
          return;
        }

        chrome.tabs.sendMessage(tabs[0].id, "refresh");
      });
    }
  },
  { urls: ["*://makler.md/*"] }
);

(async function () {
  const switchControl =
    (await chrome.storage.sync.get("switchControl")).switchControl ||
    DEFAULT_SWITCH_CONTROL;

  chrome.storage.sync.set({ switchControl });

  chrome.action.setIcon({
    path: switchControl === "on" ? activeIconPath : inactiveIconPath,
  });
})();

(async function () {
  const preferredCurrency =
    (await chrome.storage.sync.get("preferredCurrency")).preferredCurrency ||
    DEFAULT_CURRENCY;

  chrome.storage.sync.set({ preferredCurrency });
})();
