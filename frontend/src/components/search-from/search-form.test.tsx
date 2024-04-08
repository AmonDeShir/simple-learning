import { act, fireEvent, render, screen } from "@testing-library/react";
import { TestingContainer } from "../../utils/test-utils/testing-container";
import { SearchFrom } from "./search-form";
import { LanguageOption, SearchMenu } from "../search-menu/serach-menu"; 
import { MockIcon, mockIcon } from "../../utils/mocks/icon-mock";
import * as MenuIcon from '@mui/icons-material/Menu';

jest.mock("../search-menu/serach-menu");


describe(`SearchFrom`, () => {
  const mockSearchMenu = SearchMenu as jest.MockedFunction<typeof SearchMenu>;
  let searchMenuChange = (from?: LanguageOption, to?: LanguageOption) => {};
  let menuIcon: MockIcon;

  beforeAll(() => {
    menuIcon = mockIcon(MenuIcon, 'icon');
  });
  
  beforeEach(() => {
    window.localStorage.clear();
    (window.localStorage.setItem as any).mockClear();
    
    mockSearchMenu.mockImplementation((props) => {
      searchMenuChange = props.onChange ?? (() => {});
      return (<div>from={props.from ?? "undefined"} to={props.to ?? "undefined"}</div>);
    });
  });

  afterAll(() => {
    menuIcon.mockRestore();
    jest.restoreAllMocks();
  })

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

  it(`should set SearchMenu's from and to props to undefined if localStorage is empty`, () => {
    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);

    fireEvent.click(screen.getByText("icon"));

    expect(mockSearchMenu).toHaveBeenCalledWith({
      from: undefined,
      to: undefined,
      onChange: expect.any(Function)
    }, {});

    expect(screen.getByText('from=undefined to=undefined')).toBeInTheDocument();
  });

  it(`should load search's translate from from localStorage`, () => {
    window.localStorage.setItem('search-from-from', "English");
    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);

    fireEvent.click(screen.getByText("icon"));

    expect(mockSearchMenu).toHaveBeenCalledWith({
      from: "English",
      to: undefined,
      onChange: expect.any(Function)
    }, {});

    expect(screen.getByText('from=English to=undefined')).toBeInTheDocument();
  });

  it(`should load search's translate to from localStorage`, () => {
    window.localStorage.setItem('search-from-to', "English");
    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);

    fireEvent.click(screen.getByText("icon"));

    expect(mockSearchMenu).toHaveBeenCalledWith({
      from: undefined,
      to: "English",
      onChange: expect.any(Function)
    }, {});

    expect(screen.getByText('from=undefined to=English')).toBeInTheDocument();
  });

  it(`should update localStorage if search langauges were changed`, () => {
    window.localStorage.setItem('search-from-from', "English");
    window.localStorage.setItem('search-from-to', "Polish");

    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);
    
    fireEvent.click(screen.getByText("icon"));
    expect(screen.getByText('from=English to=Polish')).toBeInTheDocument();

    act(() => {
      searchMenuChange("Polish", "English");
    })

    expect(window.localStorage.getItem("search-from-from")).toEqual("Polish");
    expect(window.localStorage.getItem("search-from-to")).toEqual("English");
  });

  it(`shouldn't update localStorage if search langauges weren't changed`, () => {
    window.localStorage.setItem('search-from-from', "English");
    window.localStorage.setItem('search-from-to', "Polish");
    (window.localStorage.setItem as any).mockClear();

    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);

    fireEvent.click(screen.getByText("icon"));
    expect(screen.getByText('from=English to=Polish')).toBeInTheDocument();

    act(() => {
      searchMenuChange("English", "Polish");
    });

    expect(window.localStorage.setItem).not.toBeCalled();
  });

  it(`should remove search language from localStorage if it is undefined`, () => {
    window.localStorage.setItem('search-from-from', "English");
    window.localStorage.setItem('search-from-to', "Polish");

    render(<SearchFrom defaultValue="default value" onSubmit={()=>{}} />);

    fireEvent.click(screen.getByText("icon"));
    expect(screen.getByText('from=English to=Polish')).toBeInTheDocument();

    act(() => {
      searchMenuChange(undefined, undefined);
    })

    expect(window.localStorage.getItem("search-from-from")).toBeNull();
    expect(window.localStorage.getItem("search-from-to")).toBeNull();
  });

  it(`should call the onSubmit handler when the form is submitted`, () => {
    const onSubmit = jest.fn();
    const { wrapper } = TestingContainer();

    render(<SearchFrom defaultValue="default value"  onSubmit={onSubmit} />, { wrapper });

    const input = screen.getByDisplayValue('default value');
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(screen.getByText('Search'));

    expect(onSubmit).toHaveBeenCalledWith('test value', undefined, undefined);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it(`should call the onSubmit handler with selected search languages`, () => {
    const onSubmit = jest.fn();
    const { wrapper } = TestingContainer();

    window.localStorage.setItem('search-from-from', "English");
    window.localStorage.setItem('search-from-to', "Polish");

    render(<SearchFrom defaultValue="default value"  onSubmit={onSubmit} />, { wrapper });

    const input = screen.getByDisplayValue('default value');
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(screen.getByText('Search'));

    expect(onSubmit).toHaveBeenCalledWith('test value', "English", "Polish");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it(`should call the onSubmit handler with updated search languages`, () => {
    const onSubmit = jest.fn();
    const { wrapper } = TestingContainer();

    window.localStorage.setItem('search-from-from', "English");
    window.localStorage.setItem('search-from-to', "Polish");

    render(<SearchFrom defaultValue="default value"  onSubmit={onSubmit} />, { wrapper });

    fireEvent.click(screen.getByText("icon"));

    act(() => {
      searchMenuChange("Polish", "English");
    })

    const input = screen.getByDisplayValue('default value');
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.click(screen.getByText('Search'));

    expect(onSubmit).toHaveBeenCalledWith('test value', "Polish", "English");
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