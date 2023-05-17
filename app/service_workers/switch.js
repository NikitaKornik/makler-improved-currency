const DEFAULT_SWITCH_CONTROL = "on";

const activeIconPath = {
  128: "../images/icon-128.png",
  64: "../images/icon-64.png",
  48: "../images/icon-48.png",
};

const inactiveIconPath = {
  128: "../images/inactive/icon-128.png",
  64: "../images/inactive/icon-64.png",
  48: "../images/inactive/icon-48.png",
};

chrome.storage.onChanged.addListener(({ switchControl }) => {
  if (switchControl) {
    chrome.action.setIcon({
      path: switchControl.newValue === "on" ? activeIconPath : inactiveIconPath,
    });
  }
});

const setDefaultSwitch = async function () {
  const switchControl =
    (await chrome.storage.sync.get("switchControl")).switchControl ||
    DEFAULT_SWITCH_CONTROL;

  chrome.storage.sync.set({ switchControl });

  chrome.action.setIcon({
    path: switchControl === "on" ? activeIconPath : inactiveIconPath,
  });
};

setDefaultSwitch();
