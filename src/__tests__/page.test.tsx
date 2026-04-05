import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders Pedro Ripper as a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Pedro Ripper");
  });

  it("renders the subtitle tagline", () => {
    render(<Home />);
    expect(screen.getByText(/Co-founder & CEO of Bemobi/)).toBeInTheDocument();
  });

  it("renders the bio content", () => {
    render(<Home />);
    expect(screen.getByText(/global footprint spanning/)).toBeInTheDocument();
  });

  it("renders social links", () => {
    render(<Home />);
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders the profile photo", () => {
    render(<Home />);
    expect(screen.getByAltText("Pedro Ripper")).toBeInTheDocument();
  });
});
