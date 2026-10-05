import { describe, it, expect } from "vitest";
import {
  PROJECTS,
  STATS,
  AMA,
  CERTIFICATIONS,
  SOCIALS,
  TIMELINE,
  MARQUEE_ITEMS,
} from "../data/portfolio";

const URL_RE = /^https:\/\/.+|^mailto:.+/;

describe("portfolio data integrity", () => {
  it("includes the Student Information System project", () => {
    const sis = PROJECTS.find((p) => p.title === "Student Information System");
    expect(sis).toBeDefined();
    expect(sis.icon).toBe("school");
    expect(sis.badge).toBe("Latest");
    expect(sis.tags).toContain("Laravel 11");
  });

  it("project titles are unique", () => {
    const titles = PROJECTS.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("every project link is a valid https URL", () => {
    for (const p of PROJECTS) {
      expect(p.links.length).toBeGreaterThan(0);
      for (const l of p.links) expect(l.href).toMatch(URL_RE);
    }
  });

  it("shipped-project stat matches the number of projects", () => {
    const shipped = STATS.find((s) => s.label === "Shipped Projects");
    expect(shipped.value).toBe(PROJECTS.length);
  });

  it("every project has an icon, description, and tags", () => {
    for (const p of PROJECTS) {
      expect(p.icon).toBeTruthy();
      expect(p.desc.length).toBeGreaterThan(40);
      expect(p.tags.length).toBeGreaterThan(0);
    }
  });

  it("AMA answers stay in sync with shipped projects", () => {
    const projectsAnswer = AMA.find((a) => a.id === "projects");
    expect(projectsAnswer.a).toContain("Student Information System");
    // dedicated SIS entry exists
    const sis = AMA.find((a) => a.id === "sis");
    expect(sis).toBeDefined();
    expect(sis.keywords).toContain("sis");
  });

  it("AMA entries have unique ids and non-empty answers", () => {
    const ids = AMA.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of AMA) {
      expect(a.a.length).toBeGreaterThan(20);
      expect(a.keywords.length).toBeGreaterThan(0);
    }
  });

  it("social links use https or mailto", () => {
    for (const s of SOCIALS) expect(s.href).toMatch(URL_RE);
  });

  it("certification downloads are absolute URLs", () => {
    for (const c of CERTIFICATIONS) {
      if (c.download) expect(c.download).toMatch(/^https:\/\//);
    }
  });

  it("timeline mentions the SIS build", () => {
    const freelance = TIMELINE.find((t) => t.title === "Independent Full-Stack Developer");
    expect(freelance.points.some((p) => p.includes("Student Information System"))).toBe(true);
  });

  it("marquee has content", () => {
    expect(MARQUEE_ITEMS.length).toBeGreaterThan(5);
  });
});
