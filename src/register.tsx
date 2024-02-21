import { customElement } from 'solid-element';
import { defaultBotProps, defaultMenuProps } from './constants';
import { Bubble } from './features/bubble';
import { Full } from './features/full';
import { Menu } from './features/menu';

export const registerWebComponents = () => {
  if (typeof window === 'undefined') return;
  // @ts-expect-error element incorect type
  customElement('flowise-fullchatbot', defaultBotProps, Full);
  customElement('flowise-chatbot', defaultBotProps, Bubble);
  customElement('flowise-menu', defaultMenuProps, Menu);
};
