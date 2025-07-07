const getTranslationFile = (locale) => {
  return fetch(`../translations/${locale}.json`)
    .then((response) => {
      if (response) {
        return response.json();
      }
    })
    .catch(() => getTranslationFile("en"));
};

const getNestedValueFromStringPath = (obj, pathString) => {
  const pathArr = pathString.split(".");

  return pathArr.reduce((currentObj, key) => {
    return currentObj &&
      typeof currentObj === "object" &&
      currentObj[key] !== undefined
      ? currentObj[key]
      : undefined;
  }, obj);
};

const mainForm = document.forms.main;

mainForm.elements.lang.addEventListener("change", function (e) {
  chrome.storage.sync.set({ locale: e.target.value });
});

const updateUILanguage = (locale) => {
  document.getElementsByTagName("html")[0].setAttribute("lang", locale);
  const dataTranslateNodes = document.querySelectorAll("[data-t]");

  getTranslationFile(locale).then((jsonData) => {
    dataTranslateNodes.forEach((item) => {
      const dataAttrValue = item.getAttribute("data-t");

      const translation = getNestedValueFromStringPath(jsonData, dataAttrValue);

      item.innerText = translation;
    });
  });
};

chrome.storage.onChanged.addListener((state) => {
  if (state.locale) {
    updateUILanguage(state.locale.newValue);
  }
});

(async function () {
  const { locale } = await chrome.storage.sync.get("locale");
  mainForm.elements.lang.value = locale;

  updateUILanguage(locale);
})();
