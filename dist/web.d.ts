declare const chatbot: {
    initFull: (props: {
        chatflowid: string;
        fileTextExtractionUrl?: string | undefined;
        apiHost?: string | undefined;
        chatflowConfig?: Record<string, unknown> | undefined;
    } & {
        id?: string | undefined;
    }) => void;
    init: (props: {
        chatflowid: string;
        fileTextExtractionUrl?: string | undefined;
        apiHost?: string | undefined;
        chatflowConfig?: Record<string, unknown> | undefined;
    }) => void;
};
export default chatbot;
//# sourceMappingURL=web.d.ts.map