import { createSignal, createEffect, For, onMount, on } from 'solid-js';
import { sendMessageQuery, isStreamAvailableQuery, IncomingInput } from '@/queries/sendMessageQuery';
import { Show, mergeProps, createMemo } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { getChatbotConfig } from '@/queries/sendMessageQuery';
import { TextInput } from './inputs/textInput';
import { GuestBubble } from './bubbles/GuestBubble';
import { ActionButton, BotBubble } from './bubbles/BotBubble';
import { LoadingBubble } from './bubbles/LoadingBubble';
import { SourceBubble } from './bubbles/SourceBubble';
import { BotMessageTheme, TextInputTheme, UserMessageTheme, ButtonInputTheme, TextExtractionConfig } from '@/features/bubble/types';
import { Badge } from './Badge';
import socketIOClient from 'socket.io-client';
import { Popup } from '@/features/popup';
import { Button } from './inputs/button';
import { Modal } from '@/features/modal';
import { UploadFileForm } from '@/features/modal/components/UploadFileForm';
import { UploadFile } from '@solid-primitives/upload';
import { FileBubble } from './bubbles/FileBubble';
import { sendFileToTextExtraction } from '@/queries/sendFileToExtract';
import { LoadingFileBubble } from './bubbles/LoadingFileBubble';
import { isImage } from '@/utils/isImage';

import { StarterPromptBubble } from './bubbles/StarterPromptBubble';
import { Avatar } from '@/components/avatars/Avatar';
import { DeleteButton } from '@/components/SendButton';
import { sendRequest } from '@/utils';

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

const defaultWelcomeMessage = 'Hi there! How can I help?';

export const Bot = (botProps: BotProps & { class?: string }) => {
  const props = mergeProps({ showTitle: false }, botProps);
  let chatContainer: HTMLDivElement | undefined;
  let bottomSpacer: HTMLDivElement | undefined;
  let botContainer: HTMLDivElement | undefined;

  const [fileText, setFileText] = createSignal<string>();
  const [fileSended, setFileSended] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);
  const [userInput, setUserInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [sourcePopupOpen, setSourcePopupOpen] = createSignal(false);
  const [sourcePopupSrc, setSourcePopupSrc] = createSignal({});
  const [messages, setMessages] = createSignal<MessageType[]>(
    [
      {
        message: props.welcomeMessage ?? defaultWelcomeMessage,
        type: 'apiMessage',
      },
    ],
    { equals: false },
  );
  const [socketIOClientId, setSocketIOClientId] = createSignal('');
  const [isChatFlowAvailableToStream, setIsChatFlowAvailableToStream] = createSignal(false);
  const [chatId, setChatId] = createSignal(uuidv4());
  const [starterPrompts, setStarterPrompts] = createSignal<string[]>([], { equals: false });

  onMount(() => {
    if (botProps?.observersConfig) {
      const { observeUserInput, observeLoading, observeMessages } = botProps.observersConfig;
      typeof observeUserInput === 'function' &&
        // eslint-disable-next-line solid/reactivity
        createMemo(() => {
          observeUserInput(userInput());
        });
      typeof observeLoading === 'function' &&
        // eslint-disable-next-line solid/reactivity
        createMemo(() => {
          observeLoading(loading());
        });
      typeof observeMessages === 'function' &&
        // eslint-disable-next-line solid/reactivity
        createMemo(() => {
          observeMessages(messages());
        });
    }

    if (!bottomSpacer) return;
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      chatContainer?.scrollTo(0, chatContainer.scrollHeight);
    }, 50);
  };

  /**
   * Add each chat message into localStorage
   */

  const updateLastMessage = (text: string) => {
    setMessages((data) => {
      const updated = data.map((item, i) => {
        if (i === data.length - 1) {
          return { ...item, message: item.message + text };
        }
        return item;
      });
      return [...updated];
    });
  };

  const updateLastMessageSourceDocuments = (sourceDocuments: any) => {
    setMessages((data) => {
      const updated = data.map((item, i) => {
        if (i === data.length - 1) {
          return { ...item, sourceDocuments: sourceDocuments };
        }
        return item;
      });
      return [...updated];
    });
  };

  // Handle errors
  const handleError = (message = 'Oops! There seems to be an error. Please try again.') => {
    setMessages((prevMessages) => {
      const messages: MessageType[] = [...prevMessages, { message, type: 'apiMessage' }];
      return messages;
    });
    setLoading(false);
    setUserInput('');
    scrollToBottom();
  };

  const promptClick = (prompt: string) => {
    handleSubmit(prompt);
  };

  // Handle form submission
  const handleSubmit = async (value: string, hidden = false) => {
    setUserInput(value);

    if (value.trim() === '') {
      return;
    }

    setLoading(true);
    scrollToBottom();

    // Send user question and history to API
    const welcomeMessage = props.welcomeMessage ?? defaultWelcomeMessage;
    const messageList = messages().filter((msg) => msg.message !== welcomeMessage);

    if (!hidden)
      setMessages((prevMessages) => {
        const messages: MessageType[] = [...prevMessages, { message: value, type: 'userMessage' }];
        return messages;
      });

    const body: IncomingInput = {
      question: value,
      history: messageList,
      overrideConfig: {
        text: fileText(),
      },
      chatId: chatId(),
    };

    if (props.chatflowConfig) body.overrideConfig = props.chatflowConfig;

    if (isChatFlowAvailableToStream()) body.socketIOClientId = socketIOClientId();

    const result = await sendMessageQuery({
      chatflowid: props.chatflowid,
      apiHost: props.apiHost,
      body,
    });

    if (result.data) {
      const data = result.data;
      if (!isChatFlowAvailableToStream()) {
        let text = '';
        if (data.text) text = data.text;
        else if (data.json) text = JSON.stringify(data.json, null, 2);
        else text = JSON.stringify(data, null, 2);

        setMessages((prevMessages) => {
          const messages: MessageType[] = [
            ...prevMessages,
            {
              message: text,
              sourceDocuments: data?.sourceDocuments,
              fileAnnotations: data?.fileAnnotations,
              type: 'apiMessage',
              button: data?.button,
            },
          ];
          return messages;
        });
      }
      setLoading(false);
      setUserInput('');
      scrollToBottom();
    }
    if (result.error) {
      const error = result.error;
      console.error(error);
      const err: any = error;
      const errorData = typeof err === 'string' ? err : err.response.data || `${err.response.status}: ${err.response.statusText}`;
      handleError(errorData);
      return;
    }
  };

  const clearChat = () => {
    try {
      localStorage.removeItem(`${props.chatflowid}_EXTERNAL`);
      setChatId(uuidv4());
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
    } catch (error: any) {
      const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`;
      console.error(`error: ${errorData}`);
    }
  };

  // Auto scroll chat to bottom
  createEffect(() => {
    if (messages()) scrollToBottom();
  });

  createEffect(() => {
    if (props.fontSize && botContainer) botContainer.style.fontSize = `${props.fontSize}px`;
  });

  createEffect(
    on(fileText, (t) => {
      if (fileSended() && t !== undefined) {
        handleSubmit(props.fileFirstQuestion || '', true);
      }
    }),
  );

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    const { data } = await isStreamAvailableQuery({
      chatflowid: props.chatflowid,
      apiHost: props.apiHost,
    });

    if (data) {
      setIsChatFlowAvailableToStream(data?.isStreaming ?? false);
    }

    // Get the chatbotConfig
    const result = await getChatbotConfig({
      chatflowid: props.chatflowid,
      apiHost: props.apiHost,
    });

    if (result.data) {
      const chatbotConfig = result.data;
      if (chatbotConfig.starterPrompts) {
        const prompts: string[] = [];
        Object.getOwnPropertyNames(chatbotConfig.starterPrompts).forEach((key) => {
          prompts.push(chatbotConfig.starterPrompts[key].prompt);
        });
        setStarterPrompts(prompts);
      }
    }

    const socket = socketIOClient(props.apiHost as string);

    socket.on('connect', () => {
      setSocketIOClientId(socket.id);
    });

    socket.on('start', () => {
      setMessages((prevMessages) => [...prevMessages, { message: '', type: 'apiMessage' }]);
    });

    socket.on('sourceDocuments', updateLastMessageSourceDocuments);

    socket.on('token', updateLastMessage);

    // eslint-disable-next-line solid/reactivity
    return () => {
      setUserInput('');
      setLoading(false);
      setMessages([
        {
          message: props.welcomeMessage ?? defaultWelcomeMessage,
          type: 'apiMessage',
        },
      ]);
      if (socket) {
        socket.disconnect();
        setSocketIOClientId('');
      }
    };
  });

  const isValidURL = (url: string): URL | undefined => {
    try {
      return new URL(url);
    } catch (err) {
      return undefined;
    }
  };

  const removeDuplicateURL = (message: MessageType) => {
    const visitedURLs: string[] = [];
    const newSourceDocuments: any = [];
    message.sourceDocuments.forEach((source: any) => {
      if (isValidURL(source.metadata.source) && !visitedURLs.includes(source.metadata.source)) {
        visitedURLs.push(source.metadata.source);
        newSourceDocuments.push(source);
      } else if (!isValidURL(source.metadata.source)) {
        newSourceDocuments.push(source);
      }
    });
    return newSourceDocuments;
  };

  const getFileExtension = (fileName: string) => {
    return fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  };

  const determineExtractionUrl = (fileName: string, config: TextExtractionConfig) => {
    const extension = getFileExtension(fileName); 
    switch (extension) {
      case '.pdf':
        return config.pdf || config.default;
      case '.docx':
        return config.docx || config.default;
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
        return config.image || config.default;
      case '.mp3':
      case '.wav':
        return config.audio || config.default;
      default:
        return config.default;
    }
  };
  const onUploadFormSubmit = async (files: UploadFile[]) => {
    setFileSended(true);
    setLoading(true);
    setShowModal(false);
    setMessages([
      {
        message: props.welcomeMessage ?? defaultWelcomeMessage,
        type: 'apiMessage',
      },
      { message: files[0], type: 'userFile' },
    ]);
    if (!props.fileTextExtractionUrl) {
      return;
    }
    const fileTextExtractionUrl: TextExtractionConfig = props.fileTextExtractionUrl || {}; 
    const extractUrl = determineExtractionUrl(files[0].name, fileTextExtractionUrl);
    const { text } = await sendFileToTextExtraction({
      extractUrl,
      body: { files: files[0] },
    });
    if (!text) return;

    setFileText(text);
  };
  
  const handleClickAction = (message: MessageType, index: number) => {
    if (message.button && message.button.action) {
      const { href, method, data } = message.button.action;
      sendRequest({ url: href, method, body: data });
    }
    setMessages((prevMessages) => {
      const newMessage = { ...message };
      if (newMessage.button) newMessage.button.clicked = true;
      const newMessages = [...prevMessages];

      newMessages[index] = newMessage;
      return newMessages;
    });
  };

  return (
    <>
      <div
        ref={botContainer}
        class={
          'relative flex w-full h-[calc(100vh-117px)] text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container ' +
          props.class
        }
      >
        <div class="flex w-full h-[calc(100vh-117px)] justify-center">
          <div
            style={{ 'padding-bottom': '100px', 'padding-top': '80px' }}
            ref={chatContainer}
            class="overflow-y-scroll min-w-full w-full min-h-[calc(100vh-117px)] px-3 pt-20 relative scrollable-container chatbot-chat-view scroll-smooth"
          >
            <For each={[...messages()]}>
              {(message, index) => (
                <>
                  {message.type === 'userMessage' && (
                    <GuestBubble
                      message={message.message as string}
                      backgroundColor={props.userMessage?.backgroundColor}
                      textColor={props.userMessage?.textColor}
                      showAvatar={props.userMessage?.showAvatar}
                      avatarSrc={props.userMessage?.avatarSrc}
                    />
                  )}
                  {message.type === 'apiMessage' && (
                    <BotBubble
                      message={message.message as string}
                      button={message.button}
                      buttonTheme={props.buttonInput}
                      // eslint-disable-next-line solid/reactivity
                      onButtonClick={() => handleClickAction(message, index())}
                      fileAnnotations={message.fileAnnotations}
                      apiHost={props.apiHost}
                      backgroundColor={props.botMessage?.backgroundColor}
                      textColor={props.botMessage?.textColor}
                      showAvatar={props.botMessage?.showAvatar}
                      avatarSrc={props.botMessage?.avatarSrc}
                    />
                  )}
                  {message.type === 'userFile' && (
                    <FileBubble
                      message={message.message as UploadFile}
                      backgroundColor={props.userMessage?.backgroundColor}
                      textColor={props.userMessage?.textColor}
                      showAvatar={props.userMessage?.showAvatar}
                      avatarSrc={props.userMessage?.avatarSrc}
                    />
                  )}
                  {message.type === 'userMessage' && loading() && index() === messages().length - 1 && <LoadingBubble />}
                  {message.type === 'userFile' && loading() && index() === messages().length - 1 && (
                    <LoadingFileBubble
                      backgroundColor={props.botMessage?.backgroundColor}
                      textColor={props.botMessage?.textColor}
                      showAvatar={props.botMessage?.showAvatar}
                      avatarSrc={props.botMessage?.avatarSrc}
                      text={props.loadingFileMessage}
                    />
                  )}

                  {message.sourceDocuments && message.sourceDocuments.length && (
                    <div style={{ display: 'flex', 'flex-direction': 'row', width: '100%' }}>
                      <For each={[...removeDuplicateURL(message)]}>
                        {(src) => {
                          return (
                            <a download={src.metadata.filename} href={src.metadata.downloadData}>
                              <SourceBubble pageContent={src.metadata.titulo ? src.metadata.titulo : src.pageContent} metadata={src.metadata} />
                            </a>
                          );
                        }}
                      </For>
                    </div>
                  )}
                </>
              )}
            </For>
          </div>
          {props.showTitle ? (
            <div
              style={{
                display: 'flex',
                'flex-direction': 'row',
                'align-items': 'center',
                height: '50px',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                background: props.bubbleBackgroundColor,
                color: props.bubbleTextColor,
                'border-top-left-radius': props.isFullPage ? '0px' : '6px',
                'border-top-right-radius': props.isFullPage ? '0px' : '6px',
              }}
            >
              <Show when={props.titleAvatarSrc}>
                <>
                  <div style={{ width: '15px' }} />
                  <Avatar initialAvatarSrc={props.titleAvatarSrc} />
                </>
              </Show>
              <Show when={props.title}>
                <span class="px-3 whitespace-pre-wrap font-semibold max-w-full">{props.title}</span>
              </Show>
              <div style={{ flex: 1 }} />
              <DeleteButton
                sendButtonColor={props.bubbleTextColor}
                type="button"
                isDisabled={messages().length === 1}
                class="my-2 ml-2"
                on:click={clearChat}
              >
                <span style={{ 'font-family': 'Poppins, sans-serif' }}>Clear</span>
              </DeleteButton>
            </div>
          ) : null}
          <BottomSpacer ref={bottomSpacer} />
        </div>
      </div>
      <div class="chatbot-container p-4">
        {props.showInputFile && !fileSended() ? (
          <Button
            backgroundColor={props.buttonInput?.backgroundColor}
            textColor={props.buttonInput?.textColor}
            onSubmit={() => {
              setShowModal(true);
            }}
          >
            {props.buttonInput?.text ?? 'Enviar arquivo'}
          </Button>
        ) : (
          <TextInput
            disabled={loading()}
            backgroundColor={props.textInput?.backgroundColor}
            textColor={props.textInput?.textColor}
            placeholder={loading() ? 'Gerando resposta...' : props.textInput?.placeholder}
            sendButtonColor={props.textInput?.sendButtonColor}
            fontSize={props.fontSize}
            defaultValue={userInput()}
            onSubmit={handleSubmit}
          />
        )}
        <Show when={messages().length === 1 && !loading()}>
          <Show when={starterPrompts().length > 0}>
            <div
              style={{
                display: 'flex',
                'flex-direction': 'row',
                padding: '10px',
                width: '96%',
                'flex-wrap': 'wrap',
                position: 'absolute',
                bottom: '106px',
              }}
            >
              <For each={[...starterPrompts()]}>{(key) => <StarterPromptBubble prompt={key} onPromptClick={() => promptClick(key)} />}</For>
            </div>
          </Show>
        </Show>
        <Badge badgeBackgroundColor={props.badgeBackgroundColor} poweredByTextColor={props.poweredByTextColor} botContainer={botContainer} />
      </div>
      {sourcePopupOpen() && <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)} />}
      {showModal() && (
        <Modal isOpen={showModal()} onClose={() => setShowModal(false)}>
          <UploadFileForm onSubmit={onUploadFormSubmit} buttonInput={props.buttonInput} formats={['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} />
        </Modal>
      )}
    </>
  );
};

type BottomSpacerProps = {
  ref: HTMLDivElement | undefined;
};
const BottomSpacer = (props: BottomSpacerProps) => {
  return <div ref={props.ref} class="w-full h-32" />;
};
