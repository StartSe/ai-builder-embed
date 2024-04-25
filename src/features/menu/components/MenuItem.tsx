import { Avatar } from '@/components/avatars/Avatar';

export interface MenuItemProps {
  id: string;
  title: string;
  subtitle: string;
  selected?: boolean;
  avatarSrc: string;
}

export const MenuItem = (props: MenuItemProps) => {
  return (
    <a href={`${props.id}.html`}>
      <div class={`menu-item ${props.selected ? 'selected' : ''}`}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
        <p>
          <b>{props.title}</b> - {props.subtitle}
        </p>
      </div>
    </a>
  );
};
