import { MenuIcon } from '@/components/icons/MenuIcon';

interface MenuButtonProps {
  onClick?: () => void;
}

export const MenuButton = (props: MenuButtonProps) => {
  return (
    <button onClick={() => props.onClick && props.onClick()}>
      <MenuIcon />
    </button>
  );
};
