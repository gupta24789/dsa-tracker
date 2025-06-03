const topics = ["array", "stack", "linkedlist"]; // Add more as needed

async function loadAllTopics() {
  const container = document.getElementById("content");
  container.innerHTML = "";

  for (const topic of topics) {
    try {
      const res = await fetch(`topics/${topic}.json`);
      const data = await res.json();
      const section = document.createElement("section");

      const heading = document.createElement("h2");
      heading.textContent = data.topic;
      section.appendChild(heading);

      data.problems.forEach(p => {
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="checkbox" data-id="${p.id}">
          <a href="${p.url}" target="_blank">${p.name}</a>
        `;
        section.appendChild(label);
      });

      container.appendChild(section);
    } catch (err) {
      console.error(`Failed to load ${topic}:`, err);
    }
  }
}

loadAllTopics();
