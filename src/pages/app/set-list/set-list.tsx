import { Typography } from "@mui/material";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../api/fetchData";
import { Header } from "../../../components/header/header";
import { SearchFrom } from "../../../components/search-from/search-form";
import { MasonryItem, SetsMasonry } from "../../../components/sets-masonry/sets-masonry";
import { Button } from "../../../components/styles/styles";
import { SuperMemoPhase } from "../../../super-memo/super-memo.types";
import { CenterPage, CreateNewSetContainer, StyledTypography } from "./set-list.styles";
import { AnimatedIcon } from "../../../components/animated-icon/animated-icon";
import { useAppDispatch } from "../../../redux/store";
import { editSet } from "../../../redux/slices/edit-set/edit-set";
import { YesNoDialog } from "../../../components/yes-no-dialog/yes-no-dialog";
import { useYesNoDialog } from "../../../components/yes-no-dialog/use-yes-no-dialog";
import { Loading, RegisterLoading } from "../../../components/loading/loading";
import { handleLoadingErrors } from "../../../utils/load-data/load-data";
import { loadAdvancedData } from "../../../utils/load-data/load-advanced-data";

type Set = {
  id: string;
  title: string;
  progress: { [key in SuperMemoPhase]: number };
  words?: Word[];
}

type Word = {
  id: string,
  word: string,
  meaning: string,
}

type ServerResponse = {
  sets: Set[];
  userWords?: Word[];
}


const SetList = () => {
  const [ data, setData ] = useState<ServerResponse>({ sets: [] });
  const [ loading, setLoading ] = useState<RegisterLoading>({ state: 'loading', message: '' });
  const [ search, setSearch ] = useState('');
  const abortController = useRef(new AbortController());

  const [ registerDeleteDialog, showDeleteDialog ] = useYesNoDialog<MasonryItem>((res, data) => {
    if (res === 'yes' && data) {
      deleteHandler(data);
    }
  })
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading({ state: 'loading', message: '' })

    fetchData(() => axios.get(`/api/v1/sets/search/${search}`, { signal: abortController.current.signal }), dispatch)
      .then(res => loadAdvancedData(res, ({ sets }: ServerResponse) => sets, (sets, data) => ({...data, sets}), setData, setLoading))
      .catch(e => handleLoadingErrors(e, setLoading));
  }, [dispatch, search]);

  const editHandler = (item: MasonryItem) => {
    dispatch(editSet(item.id));
    navigate(`/edit-set`);
  }

  const deleteHandler = async (item: MasonryItem) => {
    setLoading({ state: 'loading', message: '' });
    
    await fetchData(() => axios.delete(`/api/v1/sets/${item.id}`, { signal: abortController.current.signal }), dispatch)
    
    await fetchData(() => axios.get(`/api/v1/sets/search/${search}`, { signal: abortController.current.signal }), dispatch)
      .then(res => loadAdvancedData(res, ({ sets }: ServerResponse) => sets, (sets, data) => ({...data, sets}), setData, setLoading))
      .catch(e => handleLoadingErrors(e, setLoading));
  }

  useEffect(() => () => abortController.current.abort(), [dispatch]);

  return (
    <CenterPage>
      <Header title="Sets" />
      
      <SearchFrom
        defaultValue={''}
        title="Search set by name or word"
        label="Search set"
        onSubmit={setSearch}
      />

      <StyledTypography align="center" variant="h6">Results from sets</StyledTypography>

      <Loading timeout={10000} {...loading}>
        <SetsMasonry 
          sets={data.sets} 
          onClick={(set) => navigate(`/set/${set.id}`)}
          icons={
            (item) => [
              <AnimatedIcon size={25} onClick={() => editHandler(item)} Icon={EditIcon} key="0" />,
              <AnimatedIcon size={25} onClick={() => showDeleteDialog(item)} Icon={DeleteIcon} key="1" />
            ]
          }
        />
      </Loading>

      <CreateNewSetContainer>
        <Typography align="center" variant="h6">
          or create new set
        </Typography>
        
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => navigate('/edit-set')}
        >New set</Button>
      </CreateNewSetContainer>

      <YesNoDialog
        message="Are you sure you want to delete this set?"
        {...registerDeleteDialog()}
      />
    </CenterPage>
  )
}

export default SetList;