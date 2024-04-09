import { ButtonInputTheme } from '@/features/bubble/types';
export type ActionButton = {
    text: string;
    clickedText: string;
    clicked?: boolean;
    action: {
        href: string;
        method: 'GET' | 'POST';
        data: any;
    };
};
type Props = {
    message: string;
    apiHost?: string;
    fileAnnotations?: any;
    showAvatar?: boolean;
    avatarSrc?: string;
    backgroundColor?: string;
    textColor?: string;
    button?: ActionButton;
    buttonTheme?: ButtonInputTheme;
    onButtonClick?: () => void;
};
export declare const BotBubble: (props: Props) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=BotBubble.d.ts.map