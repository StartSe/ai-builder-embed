import { For, createSignal } from 'solid-js';
import styles from '../../../assets/menu.css';
import { MenuButton } from './MenuButton';
import { MenuItem, MenuItemProps } from './MenuItem';
import { MenuLogo } from '@/components/icons/MenuLogo';

export interface MenuProps {
  currentId: string;
  items: MenuItemProps[];
}

export const Menu = (props: MenuProps) => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <style>{styles}</style>
      <div class="menu">
        {open() ? (
          <div class="menu-wrapper">
            <div class="menu-content">
              <div class="menu-header">
                <MenuLogo />
              </div>
              <div class="menu-items">
                <For each={props.items}>{(item) => <MenuItem {...item} selected={item.id === props.currentId} />}</For>
              </div>
              <div class="menu-footer">
                <p>
                  Powered By <b>StartSe</b>
                </p>
              </div>
            </div>

            <div class="menu-overlay" onClick={() => setOpen(false)} />
          </div>
        ) : (
          <MenuButton onClick={() => setOpen(true)} />
        )}
      </div>
    </>
  );
};
