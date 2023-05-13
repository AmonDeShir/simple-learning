import { fireEvent, render, screen } from "@testing-library/react";
import { DiacriticButtons, lettersPerLanguage } from "./diacritic-buttons";


describe(`DiacriticButtons`, () => {
  it("should render Polish special letters", () => {
    render(<DiacriticButtons languages={["Polish"]} onClick={() => {}} />);

    for (const letter of lettersPerLanguage["Polish"]) {
      expect(screen.getByText(letter));
    }
  });

  it("should render Interslavic special letters", () => {
    render(<DiacriticButtons languages={["Interslavic"]} onClick={() => {}} />);

    for (const letter of lettersPerLanguage["Interslavic"]) {
      expect(screen.getByText(letter));
    }
  });

  it("should render Czech special letters", () => {
    render(<DiacriticButtons languages={["Czech"]} onClick={() => {}} />);

    for (const letter of lettersPerLanguage["Czech"]) {
      expect(screen.getByText(letter));
    }
  });

  it("shouldn't render any new letters for english", () => {
    render(<DiacriticButtons languages={["Interslavic", "English"]} onClick={() => {}} />);

    for (const letter of lettersPerLanguage["Interslavic"]) {
      expect(screen.getByText(letter));
    }

    const container = screen.getByText("č").parentElement;
    expect(container?.children.length === 4);
  });

  it("should mix letters from different languages without repetition", () => {
    render(<DiacriticButtons languages={["Interslavic", "English", "Polish", "Czech"]} onClick={() => {}} />);

    expect(screen.getAllByText("ą").length).toEqual(1);
    expect(screen.getAllByText("ę").length).toEqual(1);
    expect(screen.getAllByText("ż").length).toEqual(1);
    expect(screen.getAllByText("ź").length).toEqual(1);
    expect(screen.getAllByText("ó").length).toEqual(1);
    expect(screen.getAllByText("ł").length).toEqual(1);
    expect(screen.getAllByText("á").length).toEqual(1);
    expect(screen.getAllByText("č").length).toEqual(1);
    expect(screen.getAllByText("ď").length).toEqual(1);
    expect(screen.getAllByText("é").length).toEqual(1);
    expect(screen.getAllByText("ě").length).toEqual(1);
    expect(screen.getAllByText("í").length).toEqual(1);
    expect(screen.getAllByText("ň").length).toEqual(1);
    expect(screen.getAllByText("ř").length).toEqual(1);
    expect(screen.getAllByText("š").length).toEqual(1);
    expect(screen.getAllByText("ť").length).toEqual(1);
    expect(screen.getAllByText("ú").length).toEqual(1);
    expect(screen.getAllByText("ů").length).toEqual(1);
    expect(screen.getAllByText("ý").length).toEqual(1);
    expect(screen.getAllByText("ž").length).toEqual(1);

    const container = screen.getByText("č").parentElement;
    expect(container?.children.length === 19);
  });

  it(`should call onClick when letter is clicked`, () => {
    const click = jest.fn();
    render(<DiacriticButtons languages={["Interslavic"]} onClick={click} />);

    fireEvent.click(screen.getByText("č"));
    
    expect(click).toBeCalledWith("č");
    expect(click).toBeCalledTimes(1);
  })
});