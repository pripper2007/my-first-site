import { render, screen } from "@testing-library/react";
import SocialLinks from "@/components/SocialLinks";

describe("SocialLinks", () => {
  it("renders LinkedIn and X links", () => {
    render(<SocialLinks />);

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("links to correct URLs", () => {
    render(<SocialLinks />);

    expect(screen.getByText("LinkedIn")).toHaveAttribute(
      "href",
      "https://linkedin.com/in/pedroripper"
    );
    expect(screen.getByText("X")).toHaveAttribute(
      "href",
      "https://x.com/ripper_pedro"
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
});
