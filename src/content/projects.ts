import type { Project, Section } from "./types";

/** From the CV. Repository links come from the CV's own hyperlinks. */
const items: Project[] = [
  {
    slug: "itubnb",
    name: "ituBNB — AI-Assisted Hotel Booking Platform",
    blurb:
      "Hotel reservation platform built with a team of eight, which I led. I designed the backend architecture, endpoints, authentication and the Gemini API integration, including a natural-language property search that turns an unstructured query into structured filters — removing the need to set filters by hand.",
    tech: ["Python", "Flask", "React.js", "MongoDB", "Gemini API"],
    repo: "https://github.com/berkayemrekeskin/ituBNB",
  },
  {
    slug: "medar",
    name: "MedAR — AI-Powered Medical Education Platform",
    blurb:
      "A patient-specific augmented reality training platform, built to close the gap between flat radiological images and the three-dimensional anatomy they represent. I designed a three-tier Flask REST API handling authentication, file processing and a medical-imaging segmentation pipeline, feeding a Unity mobile client. Inference runs against either Google Gemini in the cloud or a local Ollama fallback, so it still works offline and privately.",
    tech: [
      "Python",
      "Flask",
      "Unity",
      "MongoDB",
      "OpenAI API",
      "TotalSegmentator",
      "AR Foundation",
    ],
    repo: "https://github.com/berkayemrekeskin/medAR",
  },
  {
    slug: "footy",
    name: "Footy — Footballer Tracking Web Application",
    blurb:
      "A web application for footballers to track and analyse their own performance. It scores strengths and weaknesses from match data, and layers role-based authentication, statistical report generation and automatic training-programme generation on top.",
    tech: ["Node.js", "Express.js", "MongoDB", "React.js"],
    repo: "https://github.com/berkayemrekeskin/Footy",
  },
];

export const projects: Extract<Section, { id: "projects" }> = {
  id: "projects",
  kind: "projects",
  title: "Projects",
  intro: "",
  items,
};
