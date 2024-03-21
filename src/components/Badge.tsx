import { StarIcon } from '@/components/icons/StarIcon';
import { onCleanup, onMount } from 'solid-js';

type Props = {
  botContainer: HTMLDivElement | undefined;
  poweredByTextColor?: string;
  badgeBackgroundColor?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonColor?: string;
  buttonLink?: string;
};

const defaultTextColor = '#303235';

export const Badge = (props: Props) => {
  let liteBadge: HTMLAnchorElement | undefined;
  let observer: MutationObserver | undefined;

  const appendBadgeIfNecessary = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((removedNode) => {
        if ('id' in removedNode && liteBadge && removedNode.id == 'lite-badge') {
          console.log("Sorry, you can't remove the brand 😅");
          props.botContainer?.append(liteBadge);
        }
      });
    });
  };

  onMount(() => {
    if (!document || !props.botContainer) return;
    observer = new MutationObserver(appendBadgeIfNecessary);
    observer.observe(props.botContainer, {
      subtree: false,
      childList: true,
    });
  });

  onCleanup(() => {
    if (observer) observer.disconnect();
  });

  return (
    <span
      style={{
        position: 'absolute',
        'font-size': '13px',
        bottom: '8px',
        padding: '10px 12px',
        margin: 'auto',
        width: '96%',
        'text-align': 'center',
        color: props.poweredByTextColor ?? defaultTextColor,
        'background-color': props.badgeBackgroundColor ?? '#ffffff',
        display: 'flex',
        'justify-content': props.showButton ? 'space-between' : 'center',
      }}
    >
      <span style={{ display: 'flex', 'align-items': 'center' }}>
        Powered by
        <a
          href={'https://www.startse.com/'}
          target="_blank"
          rel="noopener noreferrer"
          class="lite-badge"
          id="lite-badge"
          style={{
            'font-weight': 'bold',
            color: props.poweredByTextColor ?? defaultTextColor,
            'margin-left': '3px',
          }}
        >
          <span>StartSe</span>
        </a>
      </span>

      {props.showButton && (
        <button
          onClick={() => {
            window.open(props.buttonLink, '_blank');
          }}
          style={{
            border: `2px solid ${props.buttonColor || '#303235'}`,
            'border-radius': '5px',
            padding: '12.5px',
            cursor: 'pointer',
          }}
        >
          <StarIcon />
          <span style={{ 'margin-left': '5px', color: props.buttonColor || '#303235' }}>{props.buttonText}</span>
        </button>
      )}
    </span>
  );
};
