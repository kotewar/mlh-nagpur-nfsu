const form = document.querySelector('#research-form');
const source = document.querySelector('#source');
const status = document.querySelector('#status');
const results = document.querySelector('#results');
const empty = document.querySelector('#empty');
const demoButton = document.querySelector('#demo');

const sampleText = `Urban Trees and Summer Heat: A Fictional Classroom Study
Researchers compared afternoon surface temperatures across twelve urban streets during one summer week. Six streets had substantial tree cover and six had little tree cover. Tree-covered streets were on average 3 degrees Celsius cooler. Measurements were collected at the same time each afternoon. The study was observational: streets were not randomly assigned trees. Building height, traffic, and pavement materials were not controlled. The findings suggest an association between tree cover and lower surface temperature, but do not establish that trees alone caused the difference. The small sample and single week limit generalization to other cities and seasons.`;

const sampleStudy = {
  title: 'Can urban trees help streets stay cooler?',
  summary: 'In this fictional study, streets with more trees had cooler surfaces. That is a useful clue, but not proof that trees caused the difference: other street features could also matter.',
  analogy: 'Think of a street as a sunlit table. An umbrella may keep part of it cooler, but comparing two different tables also means considering what each table is made of. This illustrates the idea; it is not evidence.',
  findings: [
    { claim: 'Tree-covered streets were cooler during the observed week.', evidence: 'Tree-covered streets were on average 3 degrees Celsius cooler.' },
    { claim: 'The comparison cannot isolate the effect of trees.', evidence: 'Building height, traffic, and pavement materials were not controlled.' },
  ],
  limitations: ['Only twelve streets were measured during one summer week.', 'This was an observational comparison, not a randomized experiment.'],
  glossary: [
    { term: 'Observational study', meaning: 'Researchers measure existing conditions rather than assign a treatment.' },
    { term: 'Confounding factor', meaning: 'Another difference, such as pavement material, that could help explain the result.' },
    { term: 'Generalization', meaning: 'Applying results beyond the places and times actually studied.' },
  ],
  quiz: [
    { question: 'What did researchers actually measure?', options: ['Annual rainfall', 'Afternoon surface temperatures', 'Residents\' happiness', 'Tree growth'], answer: 1, explanation: 'They compared surface temperatures at the same time each afternoon.' },
    { question: 'Why does this not prove trees caused the cooling?', options: ['Trees cannot provide shade', 'Twelve is an even number', 'Other street differences were not controlled', 'Summer is always cool'], answer: 2, explanation: 'Building height, traffic, and pavement could also affect temperatures.' },
    { question: 'What would make the evidence more broadly useful?', options: ['Measure more cities and seasons', 'Remove all caveats', 'Use fewer streets', 'Only measure one afternoon'], answer: 0, explanation: 'A broader sample would help establish whether the pattern holds elsewhere.' },
  ],
};

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function section(title) {
  const node = element('section', undefined, 'study-section');
  node.append(element('h3', title));
  results.append(node);
  return node;
}

function render(study, label) {
  results.replaceChildren(element('h2', study.title, 'study-title'));
  section('The big idea').append(element('p', study.summary));
  section('Picture it like this').append(element('p', study.analogy));
  const findings = section('Findings, with receipts');
  for (const finding of study.findings) {
    findings.append(element('p', finding.claim), element('blockquote', finding.evidence));
  }
  const limitations = element('ul');
  for (const caveat of study.limitations) limitations.append(element('li', caveat));
  section('What this does not prove').append(limitations);
  const glossary = section('Jargon, translated');
  for (const entry of study.glossary) {
    const paragraph = element('p');
    paragraph.append(element('strong', `${entry.term}: `), document.createTextNode(entry.meaning));
    glossary.append(paragraph);
  }
  const quiz = section('Make it stick');
  let answered = 0;
  let score = 0;
  const scoreNode = element('p', 'Answer the three questions to check your understanding.');
  quiz.append(scoreNode);
  for (const [index, question] of study.quiz.entries()) {
    const card = element('div', undefined, 'quiz-question');
    card.append(element('p', `${index + 1}. ${question.question}`));
    const options = element('div', undefined, 'quiz-options');
    const feedback = element('p', '', 'quiz-feedback');
    feedback.setAttribute('role', 'status');
    for (const [optionIndex, option] of question.options.entries()) {
      const button = element('button', option);
      button.type = 'button';
      button.addEventListener('click', () => {
        answered++;
        const correct = optionIndex === question.answer;
        if (correct) score++;
        for (const [i, choice] of [...options.children].entries()) {
          choice.disabled = true;
          if (i === question.answer) choice.classList.add('correct');
        }
        if (!correct) button.classList.add('incorrect');
        feedback.textContent = `${correct ? 'Correct!' : 'Not quite.'} ${question.explanation}`;
        scoreNode.textContent = `${score} correct out of ${answered} answered${answered === 3 ? '. Study complete!' : '.'}`;
      });
      options.append(button);
    }
    card.append(options, feedback);
    quiz.append(card);
  }
  status.textContent = label;
  empty.hidden = true;
  results.hidden = false;
}

const summaries = {
  beginner: sampleStudy.summary,
  intermediate: 'Across twelve streets over one summer week, tree-covered streets had mean surface temperatures 3 degrees Celsius lower. Uncontrolled differences in buildings, traffic, and pavement prevent a causal interpretation.',
  expert: 'This small observational comparison reports a 3-degree Celsius between-group surface-temperature difference associated with canopy cover. Uncontrolled confounding, absent randomization, and restricted temporal and spatial sampling limit causal identification and external validity.',
};

source.value = sampleText;

function preview() {
  const level = document.querySelector('#level').value;
  render({ ...sampleStudy, summary: summaries[level] },
    `MOCK DEMO / ${level.toUpperCase()}: Fictional research and handcrafted guide. No Gemini API call.`);
}

demoButton.addEventListener('click', () => {
  preview();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  preview();
});
