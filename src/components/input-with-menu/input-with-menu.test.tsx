import { act, fireEvent, render, screen } from "@testing-library/react";
import { InputWithMenu } from "./input-with-menu";
import * as MenuIcon from '@mui/icons-material/Menu';
import { MockIcon, mockIcon } from "../../utils/mocks/icon-mock";


describe(`InputWithMenu`, () => {
  let icon: MockIcon;

  beforeAll(() => {
    icon = mockIcon(MenuIcon, 'icon');
  });

  afterAll(() => {
    icon.mockRestore();
  });

  it("should render children", () => {
    render(<InputWithMenu><div>child</div></InputWithMenu>);

    expect(screen.getByText("child"));
  });


  it("should show and hide menu", async () => {
    render(<InputWithMenu menu={<div>menu</div>}></InputWithMenu>);

    expect(screen.queryByText("menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("icon"));
    expect(screen.getByText("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("icon"));
    await act(async () => await new Promise(r => setTimeout(r, 500)));

    expect(screen.queryByText("menu")).not.toBeInTheDocument();
  });

  it("should show and hide menu", async () => {
    render(<InputWithMenu menu={<div>menu</div>}></InputWithMenu>);

    expect(screen.queryByText("menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("icon"));
    expect(screen.getByText("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("icon"));
    await act(async () => await new Promise(r => setTimeout(r, 500)));

    expect(screen.queryByText("menu")).not.toBeInTheDocument();
  });

  it("shouldn't close when menu or item is clicked", async () => {
    render(<InputWithMenu menu={<div>menu</div>}>input</InputWithMenu>);

    expect(screen.queryByText("menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("icon"));
    expect(screen.getByText("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("menu"));
    fireEvent.click(screen.getByText("input"));
    await act(async () => await new Promise(r => setTimeout(r, 500)));

    expect(screen.queryByText("menu")).toBeInTheDocument();

    fireEvent.click(document.body);
    await act(async () => await new Promise(r => setTimeout(r, 500)));

    expect(screen.queryByText("menu")).not.toBeInTheDocument();
  });

});