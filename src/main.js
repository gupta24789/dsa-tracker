document.addEventListener("DOMContentLoaded", () => {
  function saveCheckboxState(id, checked) {
    localStorage.setItem(id, checked ? "true" : "false");
  }

  function loadCheckboxState(id) {
    return localStorage.getItem(id) === "true";
  }

  function updateStats() {
    const totalProblems = document.querySelectorAll('input[type="checkbox"]').length;
    const completedProblems = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const progressPercentage = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

    document.getElementById('totalProblems').textContent = totalProblems;
    document.getElementById('completedProblems').textContent = completedProblems;
    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;

    // Update progress bar color based on completion
    const progressElement = document.getElementById('progressPercentage');
    if (progressPercentage >= 80) {
      progressElement.style.color = '#22c55e';
    } else if (progressPercentage >= 50) {
      progressElement.style.color = '#eab308';
    } else {
      progressElement.style.color = '#ef4444';
    }
  }

  const topics = [
    "array", "binary_search", "linkedList", "recursion", "bits",
    "stack", "sliding_window_two_pointer", "heaps", "tree", "graphs",
    "dp", "tries", "string", "greedy"
  ];

  const topicFilter = document.getElementById("topicFilter");
  const content = document.getElementById("content");

  function populateDropdown() {
    topics.forEach(topic => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      topicFilter.appendChild(option);
    });
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const problems = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const problem = {};
      headers.forEach((header, index) => {
        problem[header.trim()] = values[index] ? values[index].trim() : '';
      });
      problems.push(problem);
    }

    return problems;
  }

  async function loadTopic(topic) {
    try {
      const response = await fetch(`src/problems/${topic}.csv`);
      const csvText = await response.text();
      const problems = parseCSV(csvText);

      const section = document.createElement("section");
      section.className = "topic-section";
      
      const heading = document.createElement("h2");
      heading.textContent = topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      section.appendChild(heading);

      const problemsContainer = document.createElement("div");
      problemsContainer.className = "problems-container";

      problems.forEach((problem, index) => {
        const problemId = `${topic}-${index + 1}`;
        const problemCard = document.createElement("div");
        problemCard.className = "problem-card";

        const checked = loadCheckboxState(problemId);
        
        problemCard.innerHTML = `
          <div class="problem-header">
            <label class="checkbox-container">
              <input type="checkbox" id="${problemId}" ${checked ? "checked" : ""}>
              <span class="checkmark"></span>
            </label>
            <span class="problem-number">${index + 1}</span>
            <span class="problem-category ${problem.category}">${problem.category}</span>
          </div>
          <div class="problem-content">
            <a href="${problem.url}" target="_blank" class="problem-link">${problem.name}</a>
          </div>
        `;

        problemCard.querySelector("input").addEventListener("change", (e) => {
          saveCheckboxState(problemId, e.target.checked);
          updateStats();
          
          // Add completion animation
          if (e.target.checked) {
            problemCard.classList.add('completed');
          } else {
            problemCard.classList.remove('completed');
          }
        });

        if (checked) {
          problemCard.classList.add('completed');
        }

        problemsContainer.appendChild(problemCard);
      });

      section.appendChild(problemsContainer);
      content.appendChild(section);
    } catch (err) {
      console.error(`Error loading ${topic}:`, err);
      const errorSection = document.createElement("section");
      errorSection.innerHTML = `<h2>${topic}</h2><p>Error loading problems for this topic.</p>`;
      content.appendChild(errorSection);
    }
  }

  async function loadAllTopics(selected = "all") {
    content.innerHTML = "";
    const toLoad = selected === "all" ? topics : [selected];

    for (const topic of toLoad) {
      await loadTopic(topic);
    }
    updateStats();
  }

  topicFilter.addEventListener("change", () => {
    const selected = topicFilter.value;
    loadAllTopics(selected);
  });

  // Run on startup
  populateDropdown();
  loadAllTopics();
});
