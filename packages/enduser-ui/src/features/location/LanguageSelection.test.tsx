import { render } from "../../common/utils/testHelpers";
import { LanguageSelection } from "./LanguageSelection";
import { screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";

describe.skip("LanguageSelection", () => {
  it("has Suomi and English as dropdown options, and click triggers changeLanguage callback", () => {
    const setLanguageMock = vi.fn();
    render(
      <Router>
        <LanguageSelection />
      </Router>,
    );
    const contrySelector = screen.getByRole("combobox") as HTMLInputElement;
    expect(contrySelector.value).toBe("");
    fireEvent.keyDown(contrySelector, { key: "ArrowDown" });
    const suomiDropdownOption = screen.getByText("Suomi", {
      selector: '[id^="react-select-"]',
    });
    expect(suomiDropdownOption).toBeInTheDocument();
    const englishDropdownOption = screen.getByText("English", {
      selector: '[id^="react-select-"]',
    });
    expect(englishDropdownOption).toBeInTheDocument();
    fireEvent.click(englishDropdownOption);
    expect(setLanguageMock).toHaveBeenCalledWith("en-GB");
  });
});
