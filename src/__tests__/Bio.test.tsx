import { render, screen } from "@testing-library/react";
import Bio from "@/components/Bio";

describe("Bio", () => {
  it("renders all three paragraphs with key content", () => {
    render(<Bio />);

    /* Each paragraph contains a distinctive term we can check for */
    expect(screen.getByText(/Bemobi \(BMOB3\)/)).toBeInTheDocument();
    expect(screen.getByText(/PUC-Rio/)).toBeInTheDocument();
    expect(
      screen.getByText(/co-founder and investor in other technology ventures/)
    ).toBeInTheDocument();
  });

  it("renders exactly three paragraphs", () => {
    const { container } = render(<Bio />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3);
  });
});
