

const LOCATION_KEY = "india_locations";





export async function loadLocationData() {
  if (!localStorage.getItem(LOCATION_KEY)) {

    const res = await fetch("/data/india-states-districts.json");

    const data = await res.json();

    localStorage.setItem(LOCATION_KEY, JSON.stringify(data));
  }
}

export function loadStates() {

  const data = JSON.parse(localStorage.getItem(LOCATION_KEY) || "{}");

  const stateSelect = document.getElementById("state") as HTMLSelectElement;

  stateSelect.innerHTML = `<option value="">Select State</option>`;

  Object.keys(data).forEach((state) => {

    const option = document.createElement("option");

    option.value = state;
    option.textContent = state;

    stateSelect.appendChild(option);

  });
}

export function loadDistricts(state: string) {

  const data = JSON.parse(localStorage.getItem(LOCATION_KEY) || "{}");

  const districtSelect = document.getElementById("district") as HTMLSelectElement;

  districtSelect.innerHTML = `<option value="">Select District</option>`;

  const districts = data[state] || [];

  districts.forEach((district: string) => {

    const option = document.createElement("option");

    option.value = district;
    option.textContent = district;

    districtSelect.appendChild(option);

  });
}

export async function initLocationDropdown() {

  await loadLocationData();

  loadStates();

}

initLocationDropdown();
