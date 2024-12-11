import { render } from "../../common/utils/testHelpers";
import CountrySelection from "./CountrySelection";
import { screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

export const countries = [
  {
    name: "Estonia",
    code: "EE",
    // languages: ['Estonian', 'Russian', 'English'],
    languages: ["eesti", "ру́сский", "English"],
  },
  {
    name: "Finland",
    code: "FI",
    // languages: ['Finnish', 'Swedish', 'English'],
    // languages: ['Finnish', 'English'],
    languages: ["suomi", "English"],
  },
];
test("NameConsumer shows value from provider", async () => {
  render(
    <Router>
      <CountrySelection countries={countries} />
    </Router>,
  );

  fireEvent.keyDown(screen.getByText("Select..."), { key: "ArrowDown" });
  await expect(screen.getByText("Estonia")).toBeInTheDocument();
  await expect(screen.getByText("Finland")).toBeInTheDocument();
});
