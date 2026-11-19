(function () {
  "use strict";

  const API_URL = "/api/time";
  const REFRESH_MS = 1000;

  let format = "24";
  let requestPending = false;

  function findElement(id) {
    const element = document.getElementById(id);
    if (element === null) {
      console.log(`Элемент не найден: #${id}`);
    }
    return element;
  }

  const timeElement = findElement("clockTime");
  const zoneElement = findElement("clockZone");
  const formatElement = findElement("clockFormat");
  const statusElement = findElement("clockStatus");
  const toggleButton = findElement("clockToggleBtn");

  if (!timeElement || !zoneElement || !formatElement || !statusElement || !toggleButton) {
    return;
  }

  function render(data) {
    timeElement.textContent = data.time;
    zoneElement.textContent = data.timezone;
    formatElement.textContent = data.format === "12h" ? "12-часовой формат" : "24-часовой формат";
  }

  async function updateClock() {
    if (requestPending || document.hidden) {
      return;
    }

    requestPending = true;
    const requestedFormat = format;

    try {
      const response = await fetch(`${API_URL}?format=${requestedFormat}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (requestedFormat === format) {
        render(data);
        statusElement.textContent = "";
      }
    } catch (error) {
      statusElement.textContent = "Сервер недоступен — время не обновляется";
    } finally {
      requestPending = false;
    }
  }

  toggleButton.addEventListener("click", () => {
    format = format === "24" ? "12" : "24";
    toggleButton.textContent =
      format === "24" ? "Показать 12-часовой формат" : "Показать 24-часовой формат";
    updateClock();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateClock();
    }
  });

  updateClock();
  setInterval(updateClock, REFRESH_MS);
})();
