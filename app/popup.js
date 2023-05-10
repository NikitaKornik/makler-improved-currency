const form = document.forms.main.elements;

form.refresh.addEventListener("click", function () {
  console.log("refresh");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log({ tabs }, tabs[0].id);

    if (!tabs[0].url.includes('https://makler.md')) {
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id, 'refresh');
  });
});
