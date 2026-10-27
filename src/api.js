
const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";

export async function getPatients() {
  const username = "coalition";
  const password = "skills-test";

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
