# PaperPulse

**Big ideas. Finally understood.**

A **mock concept project** for the **Best Use of the Google Gemini API** theme at MLH Nagpur / NFSU. This is an interactive prototype, not an integrated Gemini submission: all study content is handcrafted and fictional. No API key or external service is used.

## The idea

Research should not require a dictionary and three cups of coffee. PaperPulse proposes using Gemini to turn dense papers into plain-language summaries, everyday analogies, evidence-backed findings, honest limitations, and personalized quizzes.

The prototype demonstrates that experience with a fictional study about urban trees and heat:

- Three reading levels with different sample summaries.
- Findings paired with quotes from the sample research.
- An analogy, glossary, and limitations.
- A working three-question quiz with answer explanations and scoring.
- Responsive dark interface with explicit mock labels.

## Run

Requires Node.js 22 or newer. There are **no dependencies to install**.

```powershell
npm start
```

Open **http://localhost:3000**, choose a reading level, and click **Preview my study guide**.

## Proposed Gemini integration

A real version would send a user-provided research excerpt and reading level to a server-side Gemini API integration. Structured JSON output would populate the study cards and quiz. The backend would validate the response and verify quoted evidence against the source, keeping API keys out of the browser.

That integration is intentionally **not implemented** in this mock. Claims about evidence and results apply only to the fictional example. A live API integration would be needed before claiming eligibility for an award requiring actual Gemini usage.

## Development

```powershell
npm test
npm run check
```

Built with vanilla HTML, CSS, JavaScript, and a tiny local Node.js static server. The server binds to loopback only; the browser sends no content to Google or another external service.
