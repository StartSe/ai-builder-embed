import { MenuProps } from "./features/menu";
import { observersConfigType } from './components/Bot';
type BotProps = {
    chatflowid: string;
    apiHost?: string;
    chatflowConfig?: Record<string, unknown>;
    observersConfig?: observersConfigType;
};
export declare const initFull: (props: BotProps & {
    id?: string;
}) => void;
export declare const init: (props: BotProps) => void;
export declare const initMenu: (props: MenuProps) => void;
type Chatbot = {
    initFull: typeof initFull;
    init: typeof init;
    initMenu: typeof initMenu;
};
export declare const parseChatbot: () => {
    initFull: (props: BotProps & {
        id?: string;
    }) => void;
    init: (props: BotProps) => void;
    initMenu: (props: MenuProps) => void;
};
export declare const injectChatbotInWindow: (bot: Chatbot) => void;
export {};
//# sourceMappingURL=window.d.ts.map