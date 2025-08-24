document.addEventListener("DOMContentLoaded", () => {
  // Cache management for solved problems
  const SOLVED_PROBLEMS_KEY = 'dsa_tracker_solved_problems';
  let solvedProblems = new Set();

  // Load solved problems from localStorage
  function loadSolvedProblems() {
    try {
      const saved = localStorage.getItem(SOLVED_PROBLEMS_KEY);
      if (saved) {
        solvedProblems = new Set(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading solved problems:', err);
      solvedProblems = new Set();
    }
  }

  // Save solved problems to localStorage
  function saveSolvedProblems() {
    try {
      localStorage.setItem(SOLVED_PROBLEMS_KEY, JSON.stringify([...solvedProblems]));
    } catch (err) {
      console.error('Error saving solved problems:', err);
    }
  }

  function saveCheckboxState(id, checked) {
    if (checked) {
      solvedProblems.add(id);
    } else {
      solvedProblems.delete(id);
    }
    saveSolvedProblems();
  }

  function loadCheckboxState(id) {
    return solvedProblems.has(id);
  }

  function updateStats() {
    const totalProblems = document.querySelectorAll('input[type="checkbox"]').length;
    const completedProblems = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const progressPercentage = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

    document.getElementById('totalProblems').textContent = totalProblems;
    document.getElementById('completedProblems').textContent = completedProblems;
    document.getElementById('progressPercentage').textContent = `${progressPercentage}%`;

    const progressElement = document.getElementById('progressPercentage');
    if (progressPercentage >= 80) {
      progressElement.style.color = '#22c55e';
    } else if (progressPercentage >= 50) {
      progressElement.style.color = '#eab308';
    } else {
      progressElement.style.color = '#ef4444';
    }
  }

  const topicFilter = document.getElementById("topicFilter");
  const sectionFilter = document.getElementById("sectionFilter");
  const content = document.getElementById("content");
  const resetButton = document.getElementById("resetButton");
  let currentSection = "problems";
  let availableTopics = {};

  async function fetchAvailableTopics(section) {
    try {
      const timestamp = new Date().getTime(); // Add timestamp to prevent caching
      let files = [];
      
      try {
        // Try to fetch the directory listing
        const response = await fetch(`src/${section}/?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        
        if (response.ok) {
          const text = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'text/html');
          files = Array.from(doc.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => {
              const extension = section === 'problems' ? '.csv' : '.md';
              return href.endsWith(extension);
            })
            .map(href => {
              const filename = href.split('/').pop();
              return filename.replace(section === 'problems' ? '.csv' : '.md', '');
            });
        }
      } catch (err) {
        console.warn('Failed to fetch directory listing:', err);
      }

      // If no files found and it's problems section, use the static list
      if (files.length === 0 && section === 'problems') {
        files = [
          "array", "binary_search", "linkedList", "recursion", "bits",
          "stack", "sliding_window_two_pointer", "heaps", "tree", "graphs",
          "dp", "tries", "string", "greedy"
        ];
      }
      
      availableTopics[section] = files;
      return files;
    } catch (err) {
      console.error(`Error fetching topics for ${section}:`, err);
      return [];
    }
  }

  async function populateTopicDropdown(section) {
    topicFilter.innerHTML = '';
    
    if (!availableTopics[section]) {
      await fetchAvailableTopics(section);
    }

    const topics = availableTopics[section] || [];
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

  async function loadMarkdownContent(topic) {
    const timestamp = new Date().getTime(); // Add timestamp to prevent caching
    const response = await fetch(`src/${currentSection}/${topic}.md?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let markdownText = await response.text();
    const contentDiv = document.createElement("div");
    contentDiv.className = "markdown-content";
    
    // Preprocess markdown text to handle horizontal rules
    markdownText = markdownText.replace(/^[\s]*---[\s]*$/gm, '\n\n---\n\n');
    
    // Configure marked options with custom renderer
    const renderer = new marked.Renderer();
    
    // Custom renderer for horizontal rules
    renderer.hr = function() {
      return '<div class="custom-hr"><span></span></div>';
    };

    marked.setOptions({
      renderer: renderer,
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true,
      headerIds: true,
      xhtml: true,
      pedantic: false,
      mangle: false,
      headerPrefix: 'section-',
      smartLists: true,
      smartypants: true
    });

    // Use marked.js for proper markdown rendering
    contentDiv.innerHTML = marked.parse(markdownText);
    
    // Initialize syntax highlighting
    contentDiv.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });
    return contentDiv;
  }

  async function loadTopic(topic) {
    try {
      const section = document.createElement("section");
      section.className = "topic-section";
      
      const heading = document.createElement("h2");
      heading.textContent = topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      section.appendChild(heading);

      if (currentSection === 'problems') {
        // Handle CSV files for problems section
        const timestamp = new Date().getTime(); // Add timestamp to prevent caching
        const response = await fetch(`src/${currentSection}/${topic}.csv?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const problems = parseCSV(csvText);

        const problemsContainer = document.createElement("div");
        problemsContainer.className = "problems-container";

        problems.forEach((problem, index) => {
          const problemId = `${topic}-${index + 1}`;
          const problemCard = document.createElement("div");
          problemCard.className = "problem-card";

          const checked = loadCheckboxState(problemId);
          
          problemCard.innerHTML = `
            <label class="checkbox-container">
              <input type="checkbox" id="${problemId}" ${checked ? "checked" : ""}>
              <span class="checkmark"></span>
            </label>
            <span class="problem-number">${index + 1}</span>
            <span class="problem-category ${problem.category}">${problem.category}</span>
            <div class="problem-content">
              <a href="${problem.url}" target="_blank" class="problem-link">${problem.name}</a>
            </div>
          `;

          problemCard.querySelector("input").addEventListener("change", (e) => {
            saveCheckboxState(problemId, e.target.checked);
            updateStats();
            
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
      } else {
        // Handle Markdown files for cheat_sheet and patterns sections
        const contentDiv = await loadMarkdownContent(topic);
        section.appendChild(contentDiv);
      }

      content.appendChild(section);
    } catch (err) {
      console.error(`Error loading ${topic}:`, err);
      const errorSection = document.createElement("section");
      errorSection.innerHTML = `
        <h2>${topic.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
        <p class="error-message">Error loading content for this topic.</p>
      `;
      content.appendChild(errorSection);
    }
  }

  async function loadAllTopics(selected) {
    content.innerHTML = "";
    await loadTopic(selected);
    if (currentSection === 'problems') {
      updateStats();
    }
  }

  // Event Listeners
  sectionFilter.addEventListener("change", async () => {
    currentSection = sectionFilter.value;
    
    // Update visibility of stats and reset button for problems section
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
      statsContainer.style.display = currentSection === 'problems' ? 'flex' : 'none';
    }
    resetButton.style.display = currentSection === 'problems' ? 'inline-block' : 'none';
    
    // Show loading state in the topic dropdown
    topicFilter.innerHTML = '<option value="">Loading topics...</option>';
    topicFilter.disabled = true;
    
    await populateTopicDropdown(currentSection);
    topicFilter.disabled = false;
    
    if (availableTopics[currentSection] && availableTopics[currentSection].length > 0) {
      topicFilter.value = availableTopics[currentSection][0];
      loadAllTopics(availableTopics[currentSection][0]);
    }
  });

  topicFilter.addEventListener("change", () => {
    const selected = topicFilter.value;
    loadAllTopics(selected);
  });

  resetButton.addEventListener("click", () => {
    const selected = topicFilter.value;
    let checkboxes = document.querySelectorAll(`input[id^="${selected}-"]`);
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      saveCheckboxState(checkbox.id, false);
      checkbox.closest('.problem-card').classList.remove('completed');
    });
    
    updateStats();
  });

  // Initialize solved problems cache
  loadSolvedProblems();

  // Run on startup
  const statsContainer = document.querySelector('.stats-container');
  if (statsContainer) {
    statsContainer.style.display = 'flex';
  }
  resetButton.style.display = 'inline-block';
  
  // Initialize with the problems section
  topicFilter.innerHTML = '<option value="">Loading topics...</option>';
  topicFilter.disabled = true;
  
  fetchAvailableTopics(currentSection).then(() => {
    populateTopicDropdown(currentSection).then(() => {
      topicFilter.disabled = false;
      // Load the first topic by default
      if (availableTopics[currentSection] && availableTopics[currentSection].length > 0) {
        topicFilter.value = availableTopics[currentSection][0];
        loadAllTopics(availableTopics[currentSection][0]);
      }
    });
  });
});
