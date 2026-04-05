/**
 * Render tests for shared components:
 * Navbar, Footer, SectionHeader, BackToHome
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock next/link — render as a plain <a>
jest.mock("next/link", () => {
  return ({ children, ...props }: any) => <a {...props}>{children}</a>;
});

// Mock next/image — render as a plain <img>
jest.mock("next/image", () => {
  return (props: any) => <img {...props} />;
});

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
  usePathname: () => "/",
}));

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SectionHeader from "@/components/shared/SectionHeader";
import BackToHome from "@/components/shared/BackToHome";

describe("Navbar", () => {
  it("renders without crashing", () => {
    render(<Navbar />);
    // The logo text "Pedro" should be present
    expect(screen.getByText(/Pedro/)).toBeInTheDocument();
  });

  it("renders nav links", () => {
    render(<Navbar />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Talks")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();
  });

  it("renders the mobile menu button", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Menu")).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("renders without crashing", () => {
    render(<Footer />);
    // Multiple nodes contain "Pedro Ripper"; just check one exists
    expect(screen.getAllByText(/Pedro Ripper/).length).toBeGreaterThan(0);
  });

  it("renders social links", () => {
    render(<Footer />);
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("X (Twitter)")).toBeInTheDocument();
  });

  it("renders the copyright year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});

describe("SectionHeader", () => {
  it("renders label and title", () => {
    render(<SectionHeader label="Latest" title="News &amp; Media" />);
    expect(screen.getByText("Latest")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <SectionHeader label="L" title="T" subtitle="A subtitle" />
    );
    expect(screen.getByText("A subtitle")).toBeInTheDocument();
  });

  it("renders See More link when seeMoreHref is provided", () => {
    render(
      <SectionHeader label="L" title="T" seeMoreHref="/news" />
    );
    expect(screen.getByText("See More...")).toBeInTheDocument();
  });

  it("does not render See More link when seeMoreHref is absent", () => {
    render(<SectionHeader label="L" title="T" />);
    expect(screen.queryByText("See More...")).not.toBeInTheDocument();
  });
});

describe("BackToHome", () => {
  it("renders the link text", () => {
    render(<BackToHome />);
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("links to /", () => {
    render(<BackToHome />);
    const link = screen.getByText("Back to Home").closest("a");
    expect(link).toHaveAttribute("href", "/");
  });
});
