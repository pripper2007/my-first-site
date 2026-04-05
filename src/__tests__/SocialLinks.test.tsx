import { render, screen } from "@testing-library/react";
import SocialLinks from "@/components/SocialLinks";

describe("SocialLinks", () => {
  it("renders LinkedIn, X, and Email links", () => {
    render(<SocialLinks />);

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("links to correct URLs", () => {
    render(<SocialLinks />);

    expect(screen.getByText("LinkedIn")).toHaveAttribute(
      "href",
      "https://linkedin.com/in/pedroripper"
    );
    expect(screen.getByText("X")).toHaveAttribute(
      "href",
      "https://x.com/pedroripper"
    );
    expect(screen.getByText("Email")).toHaveAttribute(
      "href",
      "mailto:pedro@example.com"
    );
  });

  it("opens external links in a new tab", () => {
    render(<SocialLinks />);

    const linkedin = screen.getByText("LinkedIn");
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");

    const x = screen.getByText("X");
    expect(x).toHaveAttribute("target", "_blank");
    expect(x).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not open email link in a new tab", () => {
    render(<SocialLinks />);

    const email = screen.getByText("Email");
    expect(email).not.toHaveAttribute("target");
  });
});
