import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../testing-container";
import { ReceiveEmail } from "./receive-email";

describe(`ReceiveEmail`, () => {
  it(`should open the log-in page if the user clicks the 'Ok' button`, () => {
    const { navigationActions, wrapper } = TestingContainer();
    render(<ReceiveEmail />, { wrapper });

    fireEvent.click(screen.getAllByText('Ok')[0]);

    expect(navigationActions['SELECT'].payload).toEqual({
      path: "/log-in",
      updateHistory: true,
    });
  })
})