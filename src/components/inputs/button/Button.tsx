
import { ParentProps } from 'solid-js'

type Props = ParentProps & {
    backgroundColor?: string
    textColor?: string
    disabled?: boolean
    onSubmit: (event: MouseEvent) => void
}

const defaultBackgroundColor = '#ffffff'
const defaultTextColor = '#303235'

export const Button = (props: Props) => {
    return (
        <button
            class={'flex justify-center items-center upload-file-button'}
            style={{
                
                width: '100%',
                left: '20px',
                right: '20px',
                bottom: '75px',
                margin: 'auto',
                "z-index": 1000,
                "background-color": props.backgroundColor ?? defaultBackgroundColor,
                color: props.textColor ?? defaultTextColor,
            }}
            onClick={event => props.onSubmit(event)}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    )
}
