async function loadAllTopics() {
  const topics = ["array", "stack", "linkedlist"]; // Update this list
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

      data.problems.forEach((problem, index) => {
        const autoId = `${topic}-${index + 1}`;
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="checkbox" data-id="${autoId}">
          <a href="${problem.url}" target="_blank">${problem.name}</a>
        `;
        section.appendChild(label);
      });

      container.appendChild(section);
    } catch (err) {
      console.error(`Failed to load ${topic}.json:`, err);
    }
  }
}
