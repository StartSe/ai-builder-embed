import { Show, onMount } from 'solid-js';
import { Avatar } from '../avatars/Avatar';
import { Marked } from '@ts-stack/markdown';

type Props = {
  message: string;
  showAvatar?: boolean;
  avatarSrc?: string;
  backgroundColor?: string;
  textColor?: string;
};

const defaultBackgroundColor = '#3B81F6';
const defaultTextColor = '#ffffff';

Marked.setOptions({ isNoP: true });

export const GuestBubble = (props: Props) => {
  let userMessageEl: HTMLDivElement | undefined;

  const addBlankTargetToLinks = (message: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(message, 'text/html');
    const links = doc.querySelectorAll('a:not([target="_blank"])');

    links.forEach((link) => {
      link.setAttribute('target', '_blank');
    });

    return doc.body.innerHTML;
  };

  onMount(() => {
    if (userMessageEl) {
      const parsedMessage = Marked.parse(props.message);
      const messageWithBlankTarget = addBlankTargetToLinks(parsedMessage);
      userMessageEl.innerHTML = messageWithBlankTarget;
    }
  });

  return (
    <div class="flex justify-end mb-2 items-start guest-container px-6 pr-4 py-4 gap-4">
      <p
        ref={userMessageEl}
        class="max-w-full justify-start items-start"
        data-testid="guest-bubble"
        style={{
          'font-family': 'IBM Plex Sans',
          'font-size': '14px',
          'line-height': '16.8px',
          'letter-spacing': '0.5px',
          'background-color': props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      />
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
    </div>
  );
};
