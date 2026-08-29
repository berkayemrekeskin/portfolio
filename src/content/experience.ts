import { CV, LIVE_SOCIALS } from "./site";
import type { Role, Section } from "./types";

/** From the CV, most recent first. */
const roles: Role[] = [
  {
    company: "Yapı Kredi Teknoloji",
    title: "Software Engineering Intern",
    start: "Feb 2026",
    end: "present",
    bullets: [
      "Developed a full-stack internal data management application (Java Spring Boot, Oracle PL/SQL, React.js) with multiple microservices across several core data domains.",
      "Wrote unit tests with Mockito and JUnit 5, reaching 90–95% coverage per service.",
      "Built a Kafka consumer for event-driven data processing, and wrote task-specific SQL queries against enterprise datasets.",
      "Configured EVAM files for application-level settings, and completed internal training in Java, Spring Boot and PowerDesigner.",
      "Worked in a cross-functional enterprise team using Agile/Scrum, Jira and Git.",
    ],
    tech: [
      "Java",
      "Spring Boot",
      "Oracle PL/SQL",
      "React.js",
      "Kafka",
      "JUnit 5",
      "Mockito",
      "Jira",
      "Git",
    ],
  },
  {
    company: "Aselsan",
    title: "Software Engineering Intern",
    start: "Aug 2025",
    end: "Sep 2025",
    bullets: [
      "Built a graph-based data visualisation tool for interpreting large-scale, unstructured company datasets.",
      "Designed an interactive UI exposing data dependencies, optimising graph traversal for usability and performance.",
    ],
    tech: ["React", "Redux", "React Flow"],
  },
];

export const experience: Extract<Section, { id: "experience" }> = {
  id: "experience",
  kind: "experience",
  title: "Experience",
  intro:
    "Computer Engineering graduate from Istanbul Technical University, working on scalable backend systems, RESTful API design and microservices.",
  roles,
  cv: CV,
  socials: LIVE_SOCIALS.filter((s) => s.platform === "linkedin"),
};
