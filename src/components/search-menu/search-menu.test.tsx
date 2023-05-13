import { fireEvent, render, screen } from "@testing-library/react";
import { SearchMenu } from "./serach-menu";
import userEvent from "@testing-library/user-event";

describe(`SearchMenu`, () => {
  it(`should render translate from autocompleate `, () => {
    jest.restoreAllMocks();
    render(<SearchMenu />);

    expect(screen.getByLabelText('Translate from:')).toBeInTheDocument();
  });

  it(`should render translate to autocompleate `, () => {
    render(<SearchMenu />);

    expect(screen.getByLabelText('Translate to:')).toBeInTheDocument();
  });

  it('should load search languages from props', () => {
    render(<SearchMenu from="Polish" to="English" />);

    expect(screen.getByDisplayValue('Polish')).toBeInTheDocument();
    expect(screen.getByDisplayValue('English')).toBeInTheDocument();
  })

  it('should call onChange on language selection', async () => {
    const changeSpy = jest.fn();
    render(<SearchMenu from="Interslavic" to="Interslavic" onChange={changeSpy} />);

    const from = screen.getByTestId('search-menu-from');

    const to = screen.getByTestId('search-menu-to');


    userEvent.click(from);
    userEvent.type(from, "Eng");
    fireEvent.keyDown(from, { key: 'ArrowDown' })
    fireEvent.keyDown(from, { key: 'Enter' })
    expect(changeSpy).toBeCalledWith("English", "Interslavic");

    userEvent.click(to);
    userEvent.type(to, "Pol");
    fireEvent.keyDown(to, { key: 'ArrowDown' })
    fireEvent.keyDown(to, { key: 'Enter' })
    expect(changeSpy).toBeCalledWith("Interslavic", "Polish");

    expect(changeSpy).toBeCalledTimes(2);
  })

  it('should call onChange with undefined if language selection textbox is empty', async () => {
    const changeSpy = jest.fn();
    render(<SearchMenu from="Interslavic" to="Interslavic" onChange={changeSpy} />);

    const from = screen.getByTestId('search-menu-from');
    const to = screen.getByTestId('search-menu-to');

    userEvent.click(from);
    userEvent.clear(from);
    fireEvent.keyDown(from, { key: 'Enter' })
    expect(changeSpy).toBeCalledWith(undefined, "Interslavic");

    userEvent.click(to);
    userEvent.clear(to);
    fireEvent.keyDown(to, { key: 'Enter' })
    expect(changeSpy).toBeCalledWith("Interslavic", undefined);
    
    expect(changeSpy).toBeCalledTimes(2);
  })

  it('should display all supported languages', () => {
    render(<SearchMenu from="Polish"/>);

    fireEvent.mouseDown(screen.getByTestId('search-menu-from'));

    expect(screen.getByText('Polish')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Interslavic')).toBeInTheDocument();
  })
});