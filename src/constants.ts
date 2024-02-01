import type { BubbleProps } from './features/bubble'

export const defaultBotProps: BubbleProps = {
    chatflowid: '',
    apiHost: undefined,
    fileTextExtractionUrl: {
        default: '',
        image: ''
    },
    chatflowConfig: undefined,
    theme: undefined
}
