//compromise.js NLP to extact nouns/people/entities/topics
//weights are added for preference on stronger matches

function extractKeywords(query) {
  const doc = nlp(query);
  const strong = [
    ...doc.people().out("array"),
    ...doc.organizations().out("array"),
  ].map((k) => ({ term: k.toLowerCase(), weight: 3 }));

  const medium = doc
    .topics()
    .out("array")
    .map((k) => ({ term: k.toLowerCase(), weight: 2 }));

  const weak = doc
    .nouns()
    .out("array")
    .map((k) => ({ term: k.toLowerCase(), weight: 1 }));

  //words to ignore
  const stopwords = new Set([
    "want",
    "to",
    "a",
    "an",
    "and",
    "the",
    "for",
    "but",
    "that",
    "this",
    "are",
    "was",
    "with",
    "from",
    "have",
    "not",
    "what",
    "when",
    "how",
    "why",
    "will",
    "can",
    "all",
    "been",
    "has",
    "had",
    "its",
    "you",
    "your",
    "their",
    "they",
    "them",
    "than",
    "then",
    "into",
  ]);

  // keeps highest weight if term appears in multiple categories
  const seen = new Map();
  for (const kw of [...strong, ...medium, ...weak]) {
    const words = kw.term.split(" ");

    if (words.length === 1) {
      if (!stopwords.has(kw.term) && kw.term.length > 2) {
        if (!seen.has(kw.term) || seen.get(kw.term) < kw.weight) {
          seen.set(kw.term, kw.weight);
        }
      }
    } else {
      for (const word of words) {
        if (word.length > 2 && !stopwords.has(word)) {
          if (!seen.has(word) || seen.get(word) < kw.weight) {
            seen.set(word, kw.weight);
          }
        }
      }
    }
  }

  //add query words that ren't stopwords but are also not recognized by compromise
  for (const word of query.toLowerCase().split(" ")) {
    if (word.length > 2 && !stopwords.has(word) && !seen.has(word)) {
      seen.set(word, 1);
    }
  }

  console.log(seen);

  return seen;
}

//TF-IDF scoring (compare against whats in vault and examine score)
//if match found, send notification (which includes URL and reason)
function matchEntries(keywords, entries) {
  const results = [];
  const SCORE_THRESHOLD = 1;

  for (const entry of entries) {
    const reasonText = entry.reason.toLowerCase();
    let hostname = "";
    try {
      hostname = new URL(entry.url).hostname.toLowerCase();
    } catch {
      hostname = entry.url.toLowerCase();
    }

    let score = 0;
    for (const [term, weight] of keywords) {
      if (reasonText.includes(term)) score += weight * 2;
      if (hostname.includes(term)) score += weight * 0.5;
    }

    if (score >= SCORE_THRESHOLD) {
      console.log(entry);
      console.log(score);
      results.push({ entry, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

//query work
function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("q");
}

async function run() {
  const query = getSearchQuery();
  console.log("Query:", query);
  if (!query) return;

  const result = await chrome.runtime.sendMessage({ type: "GET_ENTRIES" });
  console.log("Entries from session:", result.entries);
  if (!result.entries || result.entries.length === 0) return;

  const keywords = extractKeywords(query);
  console.log("Keywords:", [...keywords.entries()]);

  const matches = matchEntries(keywords, result.entries);
  console.log("Matches:", matches);

  if (matches.length > 0) {
    const top = matches[0].entry;
    alert(
      `Tab Echo: You saved a related tab!\n\nReason: ${top.reason}\nURL: ${top.url}`
    );
  }
}

run();
