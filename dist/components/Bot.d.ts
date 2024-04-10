import { ActionButton } from './bubbles/BotBubble';
import { BotMessageTheme, TextInputTheme, UserMessageTheme, ButtonInputTheme, TextExtractionConfig } from '@/features/bubble/types';
import { UploadFile } from '@solid-primitives/upload';
type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting' | 'userFile';
type observerConfigType = (accessor: string | boolean | object | MessageType[]) => void;
export type observersConfigType = Record<'observeUserInput' | 'observeLoading' | 'observeMessages', observerConfigType>;
export type MessageType = {
    message: string | UploadFile;
    type: messageType;
    button?: ActionButton;
    sourceDocuments?: any;
    fileAnnotations?: any;
};
export type BotProps = {
    chatflowid: string;
    apiHost?: string;
    fileTextExtractionUrl?: TextExtractionConfig;
    showInputFile?: boolean;
    fileFirstQuestion?: string;
    loadingFileMessage?: string;
    chatflowConfig?: Record<string, unknown>;
    welcomeMessage?: string;
    botMessage?: BotMessageTheme;
    userMessage?: UserMessageTheme;
    textInput?: TextInputTheme;
    buttonInput?: ButtonInputTheme;
    poweredByTextColor?: string;
    badgeBackgroundColor?: string;
    bubbleBackgroundColor?: string;
    bubbleTextColor?: string;
    showTitle?: boolean;
    title?: string;
    titleAvatarSrc?: string;
    fontSize?: number;
    isFullPage?: boolean;
    observersConfig?: observersConfigType;
};
export declare const Bot: (botProps: BotProps & {
    class?: string;
}) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=Bot.d.ts.map