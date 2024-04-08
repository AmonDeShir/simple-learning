import { Box, Slide } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";

type Props = PropsWithChildren<{
  id: string;
}>


export const SlideUpdate = ({ id, children }: Props) => {
  const [ items, setItems ] = useState([{ id, appear: false, item: children }]);

  useEffect(() => {
    let timeout: number | undefined = undefined;

    setTimeout(() => {
      setItems((items) => {
        if (id !== items.at(-1)?.id) {
          return [items[items.length-1], { id, appear: true, item: children }]
        }
  
        return items;
      });
    }, 510);


    return clearTimeout(timeout);
  }, [id, children])

  return (
    <>
      { items.map((item) => (
        <Slide key={item.id} direction={ item.id === id ? 'right' : 'left' } in={item.id === id} mountOnEnter unmountOnExit timeout={500}>
          <Box>
            { item.item}
          </Box>
        </Slide>
      ))}
    </>
  );
}