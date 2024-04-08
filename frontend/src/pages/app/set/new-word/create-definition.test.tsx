import * as CloseIcon from '@mui/icons-material/Close';
import { fireEvent, render, screen } from "@testing-library/react";
import { mockIcon, MockIcon } from "../../../../utils/mocks/icon-mock";
import { TestingContainer } from "../../../../utils/test-utils/testing-container";
import { CreateDefinition } from "./create-definition";

const usedIn = [
  {
    id: '1',
    title: 'Set 1'
  },
  {
    id: '2',
    title: 'Set 2'
  }
];

const common = {
  id: '0_1',
  word: 'Word',
  meaning: 'Translation',
  language: "English" as const,
  error: {}
}

const data = {
  created: {
    ...common,
    type: 'create',
    usedIn: usedIn
  },
  edited: {
    ...common,
    type: 'edit',
    usedIn: usedIn
  },
  imported1: {
    ...common,
    type: 'import',
    usedIn: usedIn
  },
  imported2: {
    ...common,
    type: 'import',
    usedIn: undefined
  },
  imported3: {
    ...common,
    type: 'import',
    usedIn: new Array<{id: string, title: string }>()
  }
} as const;

describe('CreateDefinition', () => {
  let closeIcon: MockIcon;

  beforeAll(() => {
    closeIcon = mockIcon(CloseIcon, 'close icon');
  });

  afterAll(() => {
    closeIcon.mockRestore();
  });

  it(`should render component description`, () => {
    const { wrapper } = TestingContainer();
    render(<CreateDefinition data={data.created} onEdit={() => {}} />, { wrapper });
    
    expect(screen.getByText('Define your definition using the text boxes below (the example fields are optional)')).toBeInTheDocument();
  })

  describe('when edited', () => {
    it(`should display an YesNoDialog if the type of the data is 'import`, () => {
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported1} onEdit={() => {}} />, { wrapper });

      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });
    
    it(`shouldn't display an YesNoDialog if the usedIn array of the word is undefined`, async () => {
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported2} onEdit={() => {}} />, { wrapper });

      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    });
    
    it(`shouldn't display an YesNoDialog if the usedIn array of the word is an empty array`, async () => {
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported3} onEdit={() => {}} />, { wrapper });

      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    });

    it(`shouldn't display an YesNoDialog if the type of the word is 'edit'`, async () => {
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.edited} onEdit={() => {}} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    });

    it(`shouldn't display an YesNoDialog if the type of the word is 'create'`, async () => {
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.created} onEdit={() => {}} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
    });

    it(`should call the onEdit function and set the word type to 'edit' if the user clicks on the 'Yes' button`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported1} onEdit={onEdit} />, { wrapper });

      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      fireEvent.click(screen.getByText('Yes'));

      expect(onEdit).toHaveBeenCalledWith({
        ...data.imported1,
        word: 'New Word',
        type: 'edit',
      });
    });

    it(`should call the onEdit function and set the word type to 'create' if the user clicks on the 'No' button`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported1} onEdit={onEdit} />, { wrapper });

      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      fireEvent.click(screen.getByText('No'));

      expect(onEdit).toHaveBeenCalledWith({
        ...data.imported1,
        word: 'New Word',
        type: 'create',
        usedIn: []
      });
    });

    it(`shouldn't call the onEdit function if the user clicks the close icon`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported1} onEdit={onEdit} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });
      fireEvent.click(screen.getByText('close icon'));

      expect(onEdit).toHaveBeenCalledTimes(0);
    })

    it(`should call the onEdit function if the type of the word is 'edit'`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.edited} onEdit={onEdit} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });

      expect(onEdit).toHaveBeenCalledWith({
        ...data.edited,
        word: 'New Word',
      });
    })

    it(`should call the onEdit function if the type of the word is 'create'`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.created} onEdit={onEdit} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });

      expect(onEdit).toHaveBeenCalledWith({
        ...data.created,
        word: 'New Word',
      });
    })

    it(`should call the onEdit function and set the word type to 'edit' if the type of the word is 'import' and the word's usedIn is undefined`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported2} onEdit={onEdit} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });

      expect(onEdit).toHaveBeenCalledWith({
        ...data.imported2,
        word: 'New Word',
        type: 'edit',
      });
    })

    it(`should call the onEdit function and set the word type to 'edit' if the type of the word is 'import' and the word's usedIn is an empty array`, async () => {
      const onEdit = jest.fn();
      const { wrapper } = TestingContainer();
      render(<CreateDefinition data={data.imported3} onEdit={onEdit} />, { wrapper });
      
      fireEvent.change(screen.getByDisplayValue('Word'), { target: { value: 'New Word' } });

      expect(onEdit).toHaveBeenCalledWith({
        ...data.imported3,
        word: 'New Word',
        type: 'edit',
      });
    })
  });
})