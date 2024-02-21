import type { BubbleProps } from './features/bubble';
import { MenuProps } from './features/menu';

export const defaultBotProps: BubbleProps = {
  chatflowid: '',
  apiHost: undefined,
  chatflowConfig: undefined,
  theme: undefined,
  observersConfig: undefined,
};

export const defaultMenuProps: MenuProps = {
  currentId: '',
  items: [],
};
