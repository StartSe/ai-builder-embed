import { BotMessageTheme, TextInputTheme, UserMessageTheme, ButtonInputTheme, TextExtractionConfig } from '@/features/bubble/types';
import { UploadFile } from '@solid-primitives/upload';
type messageType = 'apiMessage' | 'userMessage' | 'usermessagewaiting' | 'userFile';
export type MessageType = {
    message: string | UploadFile;
    type: messageType;
    sourceDocuments?: any;
};
export type BotProps = {
    chatflowid: string;
    apiHost?: string;
    fileTextExtractionUrl: TextExtractionConfig;
    chatflowConfig?: Record<string, unknown>;
    welcomeMessage?: string;
    botMessage?: BotMessageTheme;
    userMessage?: UserMessageTheme;
    textInput?: TextInputTheme;
    buttonInput?: ButtonInputTheme;
    poweredByTextColor?: string;
    badgeBackgroundColor?: string;
    fontSize?: number;
    showButton?: boolean;
    buttonText?: string;
    buttonColor?: string;
    buttonLink?: string;
};
export declare const Bot: (props: BotProps & {
    class?: string;
}) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=Bot.d.ts.map