import Chart from "chart.js/auto";
import { getPatients } from "./api.js";
import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="dashboard">
    <h1>Patient Dashboard</h1>
    <p id="status">Loading patient information...</p>
    <section id="patient-info"></section>
  </main>
`;

async function loadPatient() {
  const status = document.querySelector("#status");
  const patientInfo = document.querySelector("#patient-info");

  try {
    const patients = await getPatients();

    const jessica = patients.find(
      patient => patient.name === "Jessica Taylor"
    );
    console.log("Jessica's complete API data:", jessica);
console.log("Blood pressure history:", jessica?.diagnosis_history);

    if (!jessica) {
      status.textContent = "Jessica Taylor was not found.";
      return;
    }

    status.textContent = "Patient information loaded successfully.";

    patientInfo.innerHTML = `
      <div class="patient-profile">
        <img
          class="patient-avatar"
          src="${jessica.profile_picture}"
          alt="Jessica Taylor"
        />
        <div>
          <h2>${jessica.name}</h2>
          <p>Age: ${jessica.age}</p>
          <p>Gender: ${jessica.gender}</p>
          <p>Date of birth: ${jessica.date_of_birth}</p>
        </div>
      </div>
      <div class="health-grid">
        <section class="health-card">
          <h3>Contact Information</h3>
          <p>Phone: ${jessica.phone_number}</p>
          <p>Emergency contact: ${jessica.emergency_contact}</p>
          <p>Insurance: ${jessica.insurance_type}</p>
        </section>

        <section class="health-card">
          <h3>Diagnostic List</h3>
          <ul>
            ${jessica.diagnostic_list.map(item => `
              <li>
                <strong>${item.name ?? item.diagnosis ?? "Diagnosis"}</strong>
                <p>${item.description ?? ""}</p>
                <span>${item.status ?? ""}</span>
              </li>
            `).join("")}
          </ul>
        </section>

        <section class="health-card">
          <h3>Lab Results</h3>
          <ul>
            ${jessica.lab_results.map(result => `
              <li>${typeof result === "string" ? result : result.name ?? "Lab result"}</li>
            `).join("")}
          </ul>
        </section>
      </div>
        <section class="health-card blood-pressure-card">
          <h3>Blood Pressure</h3>
          <div class="chart-container">
            <canvas id="bloodPressureChart"></canvas>
          </div>
        </section>
      </div>
    `;
        // Read the patient's blood pressure history
    const history = jessica.diagnosis_history ?? [];

    console.log("Diagnosis history:", history);

    const bloodPressureHistory = history
      .filter(item => item.blood_pressure)
      .slice()
      .reverse();

    const canvas = document.getElementById("bloodPressureChart");

    if (bloodPressureHistory.length > 0 && canvas) {
      new Chart(canvas, {
        type: "line",
        data: {
          labels: bloodPressureHistory.map(
            item => `${item.month} ${item.year}`
          ),
          datasets: [
            {
              label: "Systolic",
              data: bloodPressureHistory.map(
                item => Number(item.blood_pressure.systolic.value)
              ),
              borderColor: "#e76f51",
              backgroundColor: "#e76f51",
              tension: 0.3
            },
            {
              label: "Diastolic",
              data: bloodPressureHistory.map(
                item => Number(item.blood_pressure.diastolic.value)
              ),
              borderColor: "#3984d6",
              backgroundColor: "#3984d6",
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top"
            }
          },
          scales: {
             x: {
    ticks: {
      autoSkip: true,
      maxTicksLimit: 8,
      maxRotation: 30,
      minRotation: 0
    }
  },
            y: {
              title: {
                display: true,
                text: "Blood pressure (mmHg)"
              }
            }
          }
        }
      });
    } else {
      console.warn("No blood pressure history was found.");
    }
  } catch (error) {
    status.textContent = "Unable to load patient information.";
    console.error("Patient API error:", error);
  }
}

loadPatient();
