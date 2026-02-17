let selectedState = null;

/* ================= MAP ================= */

fetch("in.svg")
  .then(res => res.text())
  .then(svg => {
    const wrapper = document.querySelector(".map-wrapper");
    wrapper.innerHTML = svg;

    const tooltip = document.getElementById("tooltip");

    wrapper.querySelectorAll("path").forEach(state => {
      const getStateName = () =>
        state.getAttribute("name") ||
        state.querySelector("title")?.textContent ||
        state.id;

      state.addEventListener("mousemove", e => {
        tooltip.style.display = "block";
        tooltip.textContent = getStateName();
        tooltip.style.left = e.pageX + "px";
        tooltip.style.top = e.pageY - 30 + "px";
      });

      state.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      state.addEventListener("click", () => {
        selectedState = getStateName();
        document.getElementById("chatbot").style.display = "flex";
        addMessage(
          "AI",
          `You selected ${selectedState}. Tell me how many days or your budget.`
        );
      });
    });
  });

/* ================= CHATBOT ================= */

const chatbotBtn = document.getElementById("chatbot-btn");
const chatbot = document.getElementById("chatbot");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");

chatbotBtn.onclick = () => {
  chatbot.style.display = chatbot.style.display === "flex" ? "none" : "flex";
};

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  addMessage("You", msg);
  chatInput.value = "";

  const prompt = selectedState
    ? `Plan a trip strictly for ${selectedState}, India. ${msg}`
    : msg;

  const res = await fetch("https://travelmate-ai.snischal2004.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt })
  });

  const data = await res.json();
  addMessage("AI", data.reply);
}

/* ================= PLAN MODAL ================= */

const planOverlay = document.getElementById("planOverlay");
const closePlan = document.getElementById("closePlan");
const cityInput = document.getElementById("cityInput");
const journeyFlow = document.getElementById("journeyFlow");
const addCityBtn = document.getElementById("addCityBtn");

let journeyCities = [];

/* OPEN PLAN MODAL (SAFE) */
document.querySelectorAll(".nav-link").forEach(link => {
  if (link.textContent.trim() === "Plan") {
    link.addEventListener("click", e => {
      e.preventDefault();
      planOverlay.style.display = "flex";
    });
  }
});

/* CLOSE PLAN MODAL */
closePlan.addEventListener("click", () => {
  planOverlay.style.display = "none";
});

/* ADD CITY */
addCityBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return;

  journeyCities.push(city);
  cityInput.value = "";
  renderJourney();
});

/* RENDER JOURNEY */
function renderJourney() {
  journeyFlow.innerHTML = "";

  journeyCities.forEach(city => {
    const pill = document.createElement("div");
    pill.className = "city-pill";
    pill.textContent = city;
    journeyFlow.appendChild(pill);
  });
}
/* ================= PLAN INTERACTION ================= */

let travelType = null;
let budgetType = null;

// select traveller type
document.querySelectorAll(".option-group").forEach(group => {
  group.querySelectorAll(".option-card").forEach(card => {
    card.addEventListener("click", () => {
      group.querySelectorAll(".option-card").forEach(c =>
        c.classList.remove("selected")
      );
      card.classList.add("selected");

      if (card.textContent.includes("Solo") ||
          card.textContent.includes("Couple") ||
          card.textContent.includes("Family") ||
          card.textContent.includes("Friends")) {
        travelType = card.textContent.trim();
      } else {
        budgetType = card.textContent.trim();
      }
    });
  });
});

// BUILD TRIP BUTTON
document.querySelector(".build-trip").addEventListener("click", () => {
  if (journeyCities.length === 0) {
    alert("Please add at least one destination city.");
    return;
  }

  if (!travelType || !budgetType) {
    alert("Please select whoâ€™s travelling and your budget style.");
    return;
  }

  // TEMP RESULT (for now)
const tripData = {
  route: journeyCities,
  travellers: travelType,
  budget: budgetType
};

localStorage.setItem("tripData", JSON.stringify(tripData));
window.location.href = "trip.html";


  // next step: send this to AI
});