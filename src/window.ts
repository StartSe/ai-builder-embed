import { MenuProps } from "./features/menu"

/* eslint-disable solid/reactivity */
type BotProps = {
    chatflowid: string
    apiHost?: string
    chatflowConfig?: Record<string, unknown>
}

export const initFull = (props: BotProps & { id?: string }) => {
    const fullElement = props.id
      ? document.getElementById(props.id)
      : document.querySelector('flowise-fullchatbot')
    if (!fullElement) throw new Error('<flowise-fullchatbot> element not found.')
    Object.assign(fullElement, props)
}

export const init = (props: BotProps) => {
    const element = document.createElement('flowise-chatbot')
    Object.assign(element, props)
    document.body.appendChild(element)
}

export const initMenu = (props: MenuProps) => {
    const element = document.querySelector('flowise-menu')
    if (!element) throw new Error('<flowise-fullchatbot> element not found.')
    Object.assign(element, props)
}

type Chatbot = {
    initFull: typeof initFull
    init: typeof init
    initMenu: typeof initMenu
}

declare const window:
    | {
          Chatbot: Chatbot | undefined
      }
    | undefined

export const parseChatbot = () => ({
    initFull,
    init,
    initMenu
})

export const injectChatbotInWindow = (bot: Chatbot) => {
    if (typeof window === 'undefined') return
    window.Chatbot = { ...bot }
}
