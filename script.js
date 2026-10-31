const distances = [120, 25, 340, 18, 150, 30, 85];

const LONG_ROUTE_LIMIT = 100;
const SHORT_ROUTE_LIMIT = 30;
const MULTI_DAY_LIMIT = 500;

function findMaxDistance(routes) {
  let max = routes[0];
  for (const distance of routes) {
    if (distance > max) {
      max = distance;
    }
  }
  return max;
}

function filterLongRoutes(routes) {
  return routes.filter((distance) => distance > LONG_ROUTE_LIMIT);
}

function calculateTotalDistance(routes) {
  let total = 0;
  for (const distance of routes) {
    total += distance;
  }
  return total;
}

function getUserName() {
  const answer = prompt("Введите ваше имя:");
  if (answer === null || answer.trim() === "") {
    return "путешественник";
  }
  return answer.trim();
}

function countShortRoutes(routes) {
  let count = 0;
  let sum = 0;
  for (const distance of routes) {
    if (distance <= SHORT_ROUTE_LIMIT) {
      count++;
      sum += distance;
    }
  }
  return { count, sum };
}

function showRouteReport() {
  const userName = getUserName();

  const totalDistance = calculateTotalDistance(distances);
  const longRoutes = filterLongRoutes(distances);
  const longDistance = calculateTotalDistance(longRoutes);
  const longestLeg = findMaxDistance(distances);
  const shortRoutes = countShortRoutes(distances);

  alert(
    `Здравствуйте, ${userName}! Ваш маршрут длиной ${totalDistance} км, из них ${longDistance} км – длинные перегоны.`
  );

  console.log(`Количество коротких перегонов: ${shortRoutes.count}`);
  console.log(`Суммарная длина коротких перегонов: ${shortRoutes.sum} км`);
  console.log(`Самый длинный перегон: ${longestLeg} км`);

  if (totalDistance > MULTI_DAY_LIMIT) {
    console.log("Рекомендуется разбить маршрут на 2–3 дня");
  }
}

showRouteReport();
