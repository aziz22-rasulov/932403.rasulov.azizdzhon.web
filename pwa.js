if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(`Service worker зарегистрирован, scope: ${registration.scope}`);
      })
      .catch((error) => {
        console.log("Не удалось зарегистрировать service worker:", error);
      });
  });
} else {
  console.log("Service worker не поддерживается этим браузером");
}
