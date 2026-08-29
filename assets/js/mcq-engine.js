// MCQ Practice Engine for Pharma Study Verse
(function() {
  'use strict';

  // MCQ Engine State
  const state = {
    questions: [],
    currentIndex: 0,
    answers: [],
    selectedAnswers: {},
    score: 0,
    accuracy: 0,
    filters: {
      domain: 'all',
      difficulty: 'all',
      maxQuestions: 10
    },
    isLoaded: false,
    quizActive: false,
    quizComplete: false
  };

  // Load MCQ data
  async function loadMCQBank() {
    try {
      const response = await fetch('assets/data/practice-mcq.json');
      if (!response.ok) throw new Error('Failed to load MCQ bank');
      const data = await response.json();
      state.questions = validateAndNormalizeMCQs(data);
      state.isLoaded = true;
      renderHub();
      return true;
    } catch (error) {
      console.error('MCQ Loading Error:', error);
      renderError('Unable to load MCQ practice. Please refresh the page.');
      return false;
    }
  }

  // Validate MCQ data structure
  function validateAndNormalizeMCQs(data) {
    if (!Array.isArray(data)) {
      console.warn('MCQ data is not an array');
      return [];
    }

    const validated = data.filter(q => {
      // Check required fields
      if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length !== 4) {
        console.warn('Skipping invalid MCQ:', q.id);
        return false;
      }
      // Check answer index
      if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) {
        console.warn('Invalid answer index for MCQ:', q.id);
        return false;
      }
      // Check other required fields
      if (!q.domain || !q.difficulty || !q.explanation) {
        console.warn('Missing fields in MCQ:', q.id);
        return false;
      }
      return true;
    });

    console.log(`Loaded ${validated.length} valid MCQs out of ${data.length}`);
    return validated;
  }

  // Get unique domains
  function getDomains() {
    const domains = new Set(state.questions.map(q => q.domain));
    return Array.from(domains).sort();
  }

  // Filter questions based on selected criteria
  function filterQuestions() {
    let filtered = state.questions;

    // Domain filter
    if (state.filters.domain !== 'all') {
      filtered = filtered.filter(q => q.domain === state.filters.domain);
    }

    // Difficulty filter
    if (state.filters.difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === state.filters.difficulty);
    }

    // Shuffle
    filtered = filtered.sort(() => Math.random() - 0.5);

    // Limit to max questions
    return filtered.slice(0, state.filters.maxQuestions);
  }

  // Shuffle option order while tracking correct answer
  function shuffleOptionsWithAnswerTracking(question) {
    const options = question.options.map((opt, idx) => ({
      text: opt,
      originalIndex: idx
    }));

    options.sort(() => Math.random() - 0.5);
    const newAnswer = options.findIndex(o => o.originalIndex === question.answer);

    return {
      options: options.map(o => o.text),
      answer: newAnswer
    };
  }

  // Start quiz
  function startQuiz() {
    const selected = filterQuestions();
    if (selected.length === 0) {
      renderError('No questions match your criteria. Try different filters.');
      return;
    }

    state.questions = selected;
    state.currentIndex = 0;
    state.answers = new Array(selected.length).fill(null);
    state.selectedAnswers = {};
    state.score = 0;
    state.quizActive = true;
    state.quizComplete = false;

    renderQuiz();
  }

  // Record answer
  function recordAnswer(index) {
    state.selectedAnswers[state.currentIndex] = index;
    highlightAnswer(index);
  }

  // Move to next question
  function nextQuestion() {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex++;
      renderQuiz();
    } else {
      finishQuiz();
    }
  }

  // Previous question
  function previousQuestion() {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderQuiz();
    }
  }

  // Finish quiz
  function finishQuiz() {
    // Calculate score
    let correct = 0;
    state.questions.forEach((q, idx) => {
      if (state.selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });

    state.score = correct;
    state.accuracy = Math.round((correct / state.questions.length) * 100);
    state.quizActive = false;
    state.quizComplete = true;

    renderResults();
  }

  // Restart quiz
  function restartQuiz() {
    state.currentIndex = 0;
    state.answers = [];
    state.selectedAnswers = {};
    state.score = 0;
    state.accuracy = 0;
    state.quizActive = false;
    state.quizComplete = false;
    renderHub();
  }

  // ============ RENDERING FUNCTIONS ============

  // Render MCQ Hub (setup screen)
  function renderHub() {
    const container = document.getElementById('mcq-container');
    if (!container) return;

    const domains = getDomains();
    const domainOptions = domains.map(d => 
      `<option value="${d}">${d}</option>`
    ).join('');

    container.innerHTML = `
      <div class="mcq-hub">
        <h2>MCQ Practice Setup</h2>
        <p class="mcq-subtitle">Total Questions Available: <strong>${state.questions.length}</strong></p>

        <div class="mcq-filters">
          <div class="filter-group">
            <label for="domain-select">Subject/Domain:</label>
            <select id="domain-select">
              <option value="all">All Subjects</option>
              ${domainOptions}
            </select>
          </div>

          <div class="filter-group">
            <label for="difficulty-select">Difficulty:</label>
            <select id="difficulty-select">
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="count-select">Questions to Practice:</label>
            <select id="count-select">
              <option value="5">5 questions</option>
              <option value="10" selected>10 questions</option>
              <option value="15">15 questions</option>
              <option value="20">20 questions</option>
              <option value="50">50 questions (all)</option>
            </select>
          </div>
        </div>

        <div class="mcq-actions">
          <button id="start-quiz-btn" class="btn-primary">Start Practice</button>
        </div>

        <div class="mcq-info">
          <p><strong>Tips:</strong></p>
          <ul>
            <li>Questions are shuffled randomly each time</li>
            <li>Options are randomized for each question</li>
            <li>Full explanations provided after each answer</li>
            <li>Track your score and accuracy at the end</li>
          </ul>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('domain-select').addEventListener('change', (e) => {
      state.filters.domain = e.target.value;
    });

    document.getElementById('difficulty-select').addEventListener('change', (e) => {
      state.filters.difficulty = e.target.value;
    });

    document.getElementById('count-select').addEventListener('change', (e) => {
      state.filters.maxQuestions = parseInt(e.target.value);
    });

    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
  }

  // Render Quiz Screen
  function renderQuiz() {
    const container = document.getElementById('mcq-container');
    if (!container) return;

    const q = state.questions[state.currentIndex];
    const shuffled = shuffleOptionsWithAnswerTracking(q);
    const selected = state.selectedAnswers[state.currentIndex];
    const progress = ((state.currentIndex + 1) / state.questions.length) * 100;

    let optionsHTML = shuffled.options.map((opt, idx) => {
      const isSelected = selected === idx;
      const optionClass = isSelected ? 'selected' : '';
      return `
        <button class="option-btn ${optionClass}" data-index="${idx}">
          ${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="mcq-quiz">
        <div class="quiz-header">
          <div class="quiz-progress">
            <span class="question-counter">Question ${state.currentIndex + 1} of ${state.questions.length}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
          </div>
        </div>

        <div class="quiz-content">
          <div class="question-box">
            <span class="domain-badge">${escapeHtml(q.domain)}</span>
            <span class="difficulty-badge ${q.difficulty}">${q.difficulty.toUpperCase()}</span>
            <h3 class="question-text">${escapeHtml(q.question)}</h3>
          </div>

          <div class="options-container">
            ${optionsHTML}
          </div>

          <div class="quiz-navigation">
            <button id="prev-btn" class="btn-secondary" ${state.currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
            <button id="next-btn" class="btn-primary">${state.currentIndex === state.questions.length - 1 ? 'Finish' : 'Next'} →</button>
          </div>
        </div>
      </div>
    `;

    // Option selection
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        recordAnswer(parseInt(btn.dataset.index));
      });
    });

    // Navigation
    document.getElementById('prev-btn').addEventListener('click', previousQuestion);
    document.getElementById('next-btn').addEventListener('click', () => {
      if (state.selectedAnswers[state.currentIndex] === undefined) {
        alert('Please select an answer before continuing.');
        return;
      }
      nextQuestion();
    });
  }

  // Highlight selected answer
  function highlightAnswer(index) {
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  // Render Results
  function renderResults() {
    const container = document.getElementById('mcq-container');
    if (!container) return;

    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    state.questions.forEach((q, idx) => {
      const userAnswer = state.selectedAnswers[idx];
      if (userAnswer === undefined) {
        unanswered++;
      } else if (userAnswer === q.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const performanceMessage = 
      state.accuracy >= 80 ? 'Excellent! Strong understanding.' :
      state.accuracy >= 60 ? 'Good effort! Room for improvement.' :
      state.accuracy >= 40 ? 'Keep practicing! Focus on weak areas.' :
      'Don\'t give up! Review the material and try again.';

    container.innerHTML = `
      <div class="mcq-results">
        <div class="results-header">
          <h2>Practice Complete</h2>
          <p class="performance-message">${performanceMessage}</p>
        </div>

        <div class="results-score">
          <div class="score-circle">
            <span class="score-value">${state.accuracy}%</span>
            <span class="score-label">Accuracy</span>
          </div>
          <div class="score-details">
            <p><strong>${state.score}/${state.questions.length}</strong> Correct</p>
            <p class="detail-correct">✓ Correct: ${correct}</p>
            <p class="detail-incorrect">✗ Incorrect: ${incorrect}</p>
            <p class="detail-unanswered">⊘ Unanswered: ${unanswered}</p>
          </div>
        </div>

        <div class="results-actions">
          <button id="retry-btn" class="btn-primary">Retry This Set</button>
          <button id="new-practice-btn" class="btn-secondary">New Practice</button>
        </div>

        <div class="results-review">
          <h3>Review Your Answers</h3>
          <div id="review-container" class="review-list">
            ${generateReviewHTML()}
          </div>
        </div>
      </div>
    `;

    document.getElementById('retry-btn').addEventListener('click', () => {
      state.quizComplete = false;
      startQuiz();
    });

    document.getElementById('new-practice-btn').addEventListener('click', restartQuiz);
  }

  // Generate review HTML
  function generateReviewHTML() {
    return state.questions.map((q, idx) => {
      const userAnswer = state.selectedAnswers[idx];
      const isCorrect = userAnswer === q.answer;
      const statusClass = isCorrect ? 'correct' : unanswered ? 'unanswered' : 'incorrect';
      const statusText = userAnswer === undefined ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect';

      return `
        <div class="review-item ${statusClass}">
          <div class="review-header">
            <span class="review-number">Q${idx + 1}</span>
            <span class="review-status">${statusText}</span>
          </div>
          <p class="review-question">${escapeHtml(q.question)}</p>
          <div class="review-answer">
            <p><strong>Correct Answer:</strong> ${escapeHtml(q.options[q.answer])}</p>
            ${userAnswer !== undefined && userAnswer !== q.answer ? 
              `<p><strong>Your Answer:</strong> ${escapeHtml(q.options[userAnswer])}</p>` : 
              ''}
          </div>
          <details class="review-explanation">
            <summary>Explanation</summary>
            <p>${escapeHtml(q.explanation)}</p>
          </details>
        </div>
      `;
    }).join('');
  }

  // Render error
  function renderError(message) {
    const container = document.getElementById('mcq-container');
    if (!container) return;

    container.innerHTML = `
      <div class="mcq-error">
        <p><strong>Error:</strong> ${message}</p>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }

  // Utility: Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============ INITIALIZATION ============

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('mcq-container');
    if (container) {
      loadMCQBank();
    }
  });

  // Expose to window for global access if needed
  window.MCQEngine = {
    loadMCQBank,
    startQuiz,
    restartQuiz,
    finishQuiz
  };
})();
