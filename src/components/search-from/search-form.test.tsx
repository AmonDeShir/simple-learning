import { fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { SearchFrom } from "./search-form";

describe(`SearchFrom`, () => {
  it(`should render the title`, () => {
    render(<SearchFrom title="title" onSubmit={()=>{}} />);

    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it(`should render the label`, () => {
    render(<SearchFrom label="text" onSubmit={()=>{}} />);

    expect(screen.getByLabelText('text')).toBeInTheDocument();
  });

  it(`should set the default input value`, () => {
    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);

    expect(screen.getByDisplayValue('default value')).toBeInTheDocument();
  });

  it(`should call the onSubmit handler when the form is submitted`, () => {
    const onSubmit = jest.fn();
    const { wrapper } = TestingContainer();

    render(<SearchFrom defaultValue="default value"  onSubmit={onSubmit} />, { wrapper });

    const input = screen.getByDisplayValue('default value');
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(screen.getByText('Search'));

    expect(onSubmit).toHaveBeenCalledWith('test value');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it(`shouldn't call the onSubmit handler when the form is submitted if the text field is empty`, () => {
    const onSubmit = jest.fn();
    const { wrapper } = TestingContainer();

    render(<SearchFrom defaultValue="default value"  onSubmit={onSubmit} />, { wrapper });

    const input = screen.getByDisplayValue('default value');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByText('Search'));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});