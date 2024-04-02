import { ParentProps } from 'solid-js';
type Props = ParentProps & {
    backgroundColor?: string;
    textColor?: string;
    disabled?: boolean;
    onSubmit: (event: MouseEvent) => void;
};
export declare const Button: (props: Props) => import("solid-js").JSX.Element;
export {};
//# sourceMappingURL=Button.d.ts.map