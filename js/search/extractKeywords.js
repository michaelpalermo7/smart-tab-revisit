import nlp from "compromise";

//fetch user query
const query = new URLSearchParams(window.location.search).get("q");

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

  // keeps highest weight if term appears in multiple categories
  const seen = new Map();
  for (const kw of [...strong, ...medium, ...weak]) {
    if (!seen.has(kw.term) || seen.get(kw.term) < kw.weight) {
      seen.set(kw.term, kw.weight);
    }
  }

  return seen;
}

export const extractedKeywords = extractKeywords(query);

//2. TF-IDF scoring (compare against whats in vault and examine score)

//if match found, send notification (which includes URL and reason)
