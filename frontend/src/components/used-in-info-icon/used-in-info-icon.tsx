import { IconInfo } from "../info-icon/info-icon";

type Props = {
  usedIn?: {
    id: string;
    title: string;
  }[]
}

export function generateUsedInText(usedIn?: Props["usedIn"]) {
  if (!usedIn) {
    return "";
  }

  const sets = usedIn.map(set => `“${set.title}”`).join(', ');

  return `This definition is used in ${usedIn.length} other ${usedIn.length > 1 ? 'sets' : 'set'}: ${sets}`;
}

export const UsedInInfoIcon = ({ usedIn }: Props) => {
  if (!usedIn || usedIn.length === 0) {
    return <></>
  }

  return (
    <IconInfo text={generateUsedInText(usedIn)} />
  )
}