import type { BubbleProps } from './features/bubble';
import { MenuProps } from './features/menu';

export const defaultBotProps: BubbleProps = {
  chatflowid: '',
  apiHost: undefined,
  fileTextExtractionUrl: {
    default: '',
    image: '',
  },
  chatflowConfig: undefined,
  theme: undefined,
};

export const defaultMenuProps: MenuProps = {
  currentId: '',
  items: [],
};
