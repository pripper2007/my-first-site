import { render, screen } from "@testing-library/react";
import ProfilePhoto from "@/components/ProfilePhoto";

describe("ProfilePhoto", () => {
  it("renders an image with correct alt text", () => {
    render(<ProfilePhoto />);

    const img = screen.getByAltText("Pedro Ripper");
    expect(img).toBeInTheDocument();
  });

  it("has the rounded-full class for circular display", () => {
    render(<ProfilePhoto />);

    const img = screen.getByAltText("Pedro Ripper");
    expect(img.className).toContain("rounded-full");
  });
});
