import { clamp } from "../../utils/clamp/clamp";
import { Container, StyledProgress, Text } from "./progress.styles";

type ProgressProps = {
  /**
   * It describes how many steps the task requires.
   * If the value parameter reaches this value, the progress bar will be filled to 100%.
   *
   * It must be a value greater than or equal to zero.
   * @default 100
   */
  max?: number;
  /**
   * How much of the task that has been completed.
   * It must be a value between 0 and max.
   * @default 0
   */
  value?: number;
  /**
   * The text that is displayed before the value.
   * For example, if this parameter is set to 'Value:', the component will render "Value: 0%"
   * @default ""
   */
  text?: string;
  /**
   * The position of the text relative to the progress bar.
   * @default "center"
   */
  textPosition?: 'left' | 'right' | 'up' | 'down' | 'center' | 'center-after';
  /**
   * The format in which the value will be displayed.
   *
   * If the 'none' format is selected, the value of the progress bar won't be displayed.
   * For example, if the text parameter is set to 'Value:' and this parameter is set to 'none' then the component will render "Value:"
   *
   * @default "percent"
   */
  format?: 'percent' | 'fraction' | 'none';
  /**
   * Reverse the fill value of the component.
   *
   * This property reverse only the graphic representation of the progress, the text will be display normally.
   * If this parameter is set to true then the calculated fill value will be subtracted from the value of the max property.
   * For example, if this property is enabled, the max property is set to 100 and the value property is set to 20 then component will be render '20%' and also will be fulled in 80%.
   *
   * @default false
   */
  reverse?: boolean;
}

export const Progress = ({
  max = 100,
  value = 0,
  text = '',
  textPosition = 'center',
  format = 'percent',
  reverse = false,
}: ProgressProps) => {
  const percentage = Math.max(max, 0) ? (100 * value) / max : 100;
  const progress = reverse ? 100 - percentage : percentage;

  const decorator = () => {
    if (format === 'percent') {
      return `${percentage}%`;
    }

    if (format === 'fraction') {
      return `${value}\u00a0/\u00a0${max}`;
    }

    return '';
  };

  return (
    <Container textposition={textPosition} role="progressbar">
      <StyledProgress
        progress={Math.max(max, 0) === 0 ? 100 : clamp(progress, 0, 100)} 
      />
      <Text textposition={textPosition}>
        {(textPosition === 'center-after' ? [decorator(), text] : [text, decorator()]).filter((s) => s.length > 0).join('\u00a0')}
      </Text>
    </Container>
  )
}