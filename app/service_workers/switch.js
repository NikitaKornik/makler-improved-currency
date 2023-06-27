const DEFAULT_SWITCH_CONTROL = true;

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

function updateIcons(isActive) {
  chrome.action.setIcon({
    path: isActive ? activeIconPath : inactiveIconPath,
  });
}

chrome.storage.onChanged.addListener((e) =>
  updateIcons(e.switchControl.newValue)
);

const setDefaultSwitch = async function () {
  let { switchControl } = await chrome.storage.sync.get("switchControl");

  if (switchControl === undefined) {
    switchControl = DEFAULT_SWITCH_CONTROL;
  }

  chrome.storage.sync.set({ switchControl });

  updateIcons(switchControl);
};

setDefaultSwitch();
