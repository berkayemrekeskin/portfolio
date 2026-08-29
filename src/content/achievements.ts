import type { Achievement, Section } from "./types";

/** TODO(content): add awards, certificates and competition results. */
const items: Achievement[] = [
      {
      "title": "Yildiz Jam (GameJam)",
      'date': "2023",
      "issuer": "Yildiz Sky Lab",
      "kind": "competition",
    },
    {
      "title": "Pearson PTE English Proficiency Exam",
      'date': "2024",
      "issuer": "Pearson",
      "kind": "certificate",
    },
    {
      "title": "Cherry Hackathon",
      'date': "2026",
      "issuer": "Cherry Finance",
      "kind": "competition",
    },
    
];

export const achievements: Extract<Section, { id: "achievements" }> = {
  id: "achievements",
  kind: "achievements",
  title: "Achievements",
  intro: "",
  items,
};
