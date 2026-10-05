import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Projects from "../components/portfolio/Projects";
import { findAnswer } from "../components/portfolio/AskMeModal";
import { AMA_FALLBACK, PROJECTS } from "../data/portfolio";

describe("Projects section", () => {
  it("renders every project from the data file", () => {
    render(<Projects />);
    for (const p of PROJECTS) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
  });

  it("renders the SIS card with the Latest badge and both links", () => {
    render(<Projects />);
    expect(screen.getByText("Student Information System")).toBeInTheDocument();
    expect(screen.getByTestId("project-badge-0")).toHaveTextContent("Latest");

    const code = screen.getByTestId("project-0-link-code");
    const live = screen.getByTestId("project-0-link-live");
    expect(code).toHaveAttribute("href", "https://github.com/caelum-sky/SIS_NEW");
    expect(live).toHaveAttribute("href", "https://sis-new-seven.vercel.app");
    // external links must be safe
    expect(code).toHaveAttribute("rel", "noopener noreferrer");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders one card per project", () => {
    render(<Projects />);
    PROJECTS.forEach((_, i) => {
      expect(screen.getByTestId(`project-card-${i}`)).toBeInTheDocument();
    });
  });
});

describe("AskMe findAnswer", () => {
  it("answers stack questions", () => {
    expect(findAnswer("what stack do you use?")).toContain("Laravel");
  });

  it("answers SIS questions", () => {
    expect(findAnswer("tell me about the student information system")).toContain("Laravel 11");
    expect(findAnswer("can students download their COR?")).toContain("Certificate of Registration");
  });

  it("falls back gracefully on unknown questions", () => {
    expect(findAnswer("do you like pineapple on pizza?")).toBe(AMA_FALLBACK);
  });
});
