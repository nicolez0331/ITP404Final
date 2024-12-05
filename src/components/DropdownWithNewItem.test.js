import { render } from "@testing-library/react";
import DropdownWithNewItem from "./DropdownWithNewItem";

describe("DropdownWithNewItem", () => {
  const label = "Category";

  test("should render the dropdown with the label", () => {
    const { getByTestId } = render(
      <DropdownWithNewItem
        label={label}
        apiEndpoint="http://localhost:5500" //not used
        selectedId={null}
        setSelectedId={() => {}}
      />
    );

    expect(getByTestId("dropdown-label")).toHaveTextContent(label);
  });

  test("should render the 'Other (Enter New Category)' option", () => {
    const { getByTestId } = render(
      <DropdownWithNewItem
        label={label}
        apiEndpoint="http://localhost:5500" //not used
        selectedId={null}
        setSelectedId={() => {}}
      />
    );

    expect(getByTestId("dropdown-new-option")).toBeInTheDocument();
  });
});
