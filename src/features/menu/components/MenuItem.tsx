export interface MenuItemProps {
    id: string;
    title: string;
    subtitle: string;
    selected?: boolean;
}

export const MenuItem = (props: MenuItemProps) => {
    return <a href={`/${props.id}.html`}>
        <div class={`menu-item ${props.selected ? 'selected' : ''}`}>
            <p>
                <b>{props.title}</b> - {props.subtitle}
            </p>
        </div>
    </a>
}