import { JSXElement, Show, createSignal } from "solid-js";

type Props = {
    message: string
    children: JSXElement
}


export const Tooltip = (props: Props) => {

    const [show, setShow] = createSignal(false);

    return (
        <div style={{ position: 'relative' }}>
            <Show when={show()}>
                <div class="tooltip">
                    <p>
                        {props.message}
                    </p>
                </div>
            </Show>

            <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>{props.children}</div>
        </div>
    );
}