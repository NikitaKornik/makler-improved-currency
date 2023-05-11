const switchForm = document.forms.switch;
const mainForm = document.forms.main;

switchForm.addEventListener("change", function () {
  const value = this.elements["switch-control"].value;

  chrome.storage.sync.set({ switchControl: value });
});

(async function () {
  const { switchControl } = await chrome.storage.sync.get("switchControl");
  switchForm.elements["switch-control"].value = switchControl;
})();
