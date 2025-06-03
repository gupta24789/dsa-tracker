document.addEventListener("DOMContentLoaded", () => {
  function saveCheckboxState(id, checked) {
    localStorage.setItem(id, checked ? "true" : "false");
  }

  function loadCheckboxState(id) {
    return localStorage.getItem(id) === "true";
  }

  const topics = [
    "array", "binarySearch", "linkedList", "recursion", "bits",
    "stack", "sliding_window_two_pointer", "heaps", "tree", "graphs",
    "dp", "tries", "string", "greedy"
  ];

  const topicFilter = document.getElementById("topicFilter");
  const content = document.getElementById("content");

  function populateDropdown() {
    topics.forEach(topic => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      topicFilter.appendChild(option);
    });
  }

  async function loadTopic(topic) {
    try {
      const res = await fetch(`topics/${topic}.json`);
      const data = await res.json();

      const section = document.createElement("section");
      const heading = document.createElement("h2");
      heading.textContent = data.topic;
      section.appendChild(heading);

      data.problems.forEach((problem, index) => {
        const problemId = `${topic}-${index + 1}`;
        const label = document.createElement("label");

        const checked = loadCheckboxState(problemId);
        label.innerHTML = `
          <input type="checkbox" id="${problemId}" ${checked ? "checked" : ""}>
          <a href="${problem.url}" target="_blank">${index + 1}. ${problem.name}</a>
        `;

        label.querySelector("input").addEventListener("change", (e) => {
          saveCheckboxState(problemId, e.target.checked);
        });

        section.appendChild(label);
        section.appendChild(document.createElement("br"));
      });

      content.appendChild(section);
    } catch (err) {
      console.error(`Error loading ${topic}:`, err);
    }
  }

  async function loadAllTopics(selected = "all") {
    content.innerHTML = "";
    const toLoad = selected === "all" ? topics : [selected];

    for (const topic of toLoad) {
      await loadTopic(topic);
    }
  }

  topicFilter.addEventListener("change", () => {
    const selected = topicFilter.value;
    loadAllTopics(selected);
  });

  // Run on startup
  populateDropdown();
  loadAllTopics();
});
