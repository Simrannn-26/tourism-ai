// GET TRIP DATA SAFELY
const routeTextEl = document.getElementById("routeText");
const tripDataRaw = localStorage.getItem("tripData");

let tripData = null;

try {
  tripData = JSON.parse(tripDataRaw);
} catch (e) {
  tripData = null;
}

// HANDLE MISSING DATA
if (!tripData || !tripData.route || tripData.route.length === 0) {
  routeTextEl.textContent =
    "No route found. Please plan your trip from the main page.";
} else {
  routeTextEl.textContent = tripData.route.join(" → ");
}

// TRANSPORT SELECTION
document.querySelectorAll(".transport-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".transport-card")
      .forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});
