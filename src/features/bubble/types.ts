export type BubbleParams = {
    theme?: BubbleTheme
}

export type BubbleTheme = {
    chatWindow?: ChatWindowTheme
    button?: ButtonTheme
}

export type TextExtractionConfig = {
    default: string
    image: string
}

export type TextInputTheme = {
    backgroundColor?: string
    textColor?: string
    placeholder?: string
    sendButtonColor?: string
}

export type ButtonInputTheme = {
    backgroundColor?: string
    textColor?: string
    text?: string
}

export type UserMessageTheme = {
    backgroundColor?: string
    textColor?: string
    showAvatar?: boolean
    avatarSrc?: string
}

export type BotMessageTheme = {
    backgroundColor?: string
    textColor?: string
    showAvatar?: boolean
    avatarSrc?: string
}

export type ChatWindowTheme = {
    welcomeMessage?: string
    backgroundColor?: string
    height?: number
    width?: number
    fontSize?: number
    userMessage?: UserMessageTheme
    botMessage?: BotMessageTheme
    textInput?: TextInputTheme
    buttonInput?: ButtonInputTheme
    poweredByTextColor?: string
}

export type ButtonTheme = {
    size?: 'medium' | 'large'
    backgroundColor?: string
    iconColor?: string
    customIconSrc?: string
    bottom?: number
    right?: number
}
