import type { BubbleProps } from './features/bubble';
import { MenuProps } from './features/menu';

export const defaultBotProps: BubbleProps = {
  chatflowid: '',
  apiHost: undefined,
  showInputFile: false,
  fileFirstQuestion: undefined,
  loadingFileMessage: undefined,
  fileTextExtractionUrl: undefined,
  chatflowConfig: undefined,
  theme: undefined,
};

export const defaultMenuProps: MenuProps = {
  currentId: '',
  items: [],
};
