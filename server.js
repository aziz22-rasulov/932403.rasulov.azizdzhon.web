const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeData(use12h) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(new Date());

  const values = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = Number(part.value);
    }
  }

  const { hour, minute, second } = values;
  if (![hour, minute, second].every(Number.isFinite)) {
    throw new Error("Не удалось получить время");
  }

  let time;
  if (use12h) {
    const suffix = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 || 12;
    time = `${pad(hour12)}:${pad(minute)}:${pad(second)} ${suffix}`;
  } else {
    time = `${pad(hour)}:${pad(minute)}:${pad(second)}`;
  }

  return { time, timezone: timeZone, format: use12h ? "12h" : "24h" };
}

app.use(
  express.static(PUBLIC_DIR, {
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith("manifest.json")) {
        res.type("application/manifest+json");
      }
    }
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "about.html"));
});

app.get("/api/time", (req, res) => {
  try {
    const use12h = req.query.format === "12";
    res.json(getTimeData(use12h));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((req, res) => {
  res.status(404).type("text/plain; charset=utf-8").send("Страница не найдена");
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
