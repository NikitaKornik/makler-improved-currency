function isTargetRequest(url) {
  const feedPageRule = /\/page\/?(\d+)?$/;
  const homePageRule = /\/search/;

  return feedPageRule.test(url) || homePageRule.test(url);
}

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.method === "POST" && isTargetRequest(details.url)) {
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
