import { createSignal, createEffect, For, onMount, on } from 'solid-js';
import { sendMessageQuery, isStreamAvailableQuery, IncomingInput } from '@/queries/sendMessageQuery';
import { TextInput } from './inputs/textInput';
import { GuestBubble } from './bubbles/GuestBubble';
import { BotBubble } from './bubbles/BotBubble';
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

const defaultWelcomeMessage = 'Hi there! How can I help?';

export const Bot = (props: BotProps & { class?: string }) => {
  let chatContainer: HTMLDivElement | undefined;
  let bottomSpacer: HTMLDivElement | undefined;
  let botContainer: HTMLDivElement | undefined;

  const [fileText, setFileText] = createSignal<string>();
  const [fileSended, setFileSended] = createSignal(false);
  const [showModal, setShowModal] = createSignal(false);
  const [userInput, setUserInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [isReplying, setIsReplying] = createSignal(false);
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

  onMount(() => {
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
    setMessages((prevMessages) => [...prevMessages, { message, type: 'apiMessage' }]);
    setLoading(false);
    setUserInput('');
    scrollToBottom();
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
      setMessages((prevMessages) => [...prevMessages, { message: value, type: 'userMessage' }]);

    const body: IncomingInput = {
      question: value,
      history: messageList,
      overrideConfig: {
        text: fileText()
      }
    };

    if (props.chatflowConfig) body.overrideConfig = props.chatflowConfig;

    if (isChatFlowAvailableToStream()) body.socketIOClientId = socketIOClientId();

    const result = await sendMessageQuery({
      chatflowid: props.chatflowid,
      apiHost: props.apiHost,
      body,
    });

    if (result.data) {
      const data = handleVectaraMetadata(result.data);

      if (typeof data === 'object' && data.text && data.sourceDocuments) {
        if (!isChatFlowAvailableToStream()) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message: data.text,
              sourceDocuments: data.sourceDocuments,
              type: 'apiMessage',
            },
          ]);
        }
      } else {
        if (!isChatFlowAvailableToStream()) setMessages((prevMessages) => [...prevMessages, { message: data, type: 'apiMessage' }]);
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

  // Auto scroll chat to bottom
  createEffect(() => {
    if (messages()) scrollToBottom();
  });

  createEffect(() => {
    if (props.fontSize && botContainer) botContainer.style.fontSize = `${props.fontSize}px`;
  });

  createEffect(on(fileText, (t, prevT) => {
    if (fileSended() && t !== undefined && prevT === undefined) {
      handleSubmit('resuma este laudo médico', true)
    }
  }))

  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    const { data } = await isStreamAvailableQuery({
      chatflowid: props.chatflowid,
      apiHost: props.apiHost,
    });

    if (data) {
      setIsChatFlowAvailableToStream(data?.isStreaming ?? false);
    }

    const socket = socketIOClient(props.apiHost as string);

    socket.on('connect', () => {
      setSocketIOClientId(socket.id);
    });

    socket.on('start', () => {
      setIsReplying(true);
      setMessages((prevMessages) => [...prevMessages, { message: '', type: 'apiMessage' }]);
    });
    socket.on('end', () => {
      setIsReplying(false);
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

  const handleVectaraMetadata = (message: any): any => {
    if (message.sourceDocuments && message.sourceDocuments[0].metadata.length) {
      message.sourceDocuments = message.sourceDocuments.map((docs: any) => {
        const newMetadata: { [name: string]: any } = docs.metadata.reduce((newMetadata: any, metadata: any) => {
          newMetadata[metadata.name] = metadata.value;
          return newMetadata;
        }, {});
        return {
          pageContent: docs.pageContent,
          metadata: newMetadata,
        };
      });
    }
    return message;
  };

  const removeDuplicateURL = (message: MessageType) => {
    const visitedURLs: string[] = [];
    const newSourceDocuments: any = [];

    message = handleVectaraMetadata(message);

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

  const onUploadFormSubmit = async (files: UploadFile[]) => {
    setFileSended(true)
    setLoading(true)
    setShowModal(false)
    setMessages((prevMessages) => [...prevMessages, { message: files[0], type: 'userFile' }]);

    const { text } = await sendFileToTextExtraction(
      {
        extractUrl: isImage(files[0].name) ? props.fileTextExtractionUrl.image : props.fileTextExtractionUrl.default,
        body: { files: files[0] }
      })
    if (!text) return;

    setFileText(text)
  }

  return (
    <>
    {fileSended() && <button onClick={() => {location.reload()}} class='header-button'>+ Laudo médico</button>}
      <div
        ref={botContainer}
        class={'relative flex w-full h-[calc(100vh-117px)] text-base overflow-hidden bg-cover bg-center flex-col items-center chatbot-container ' + props.class}>
        <div class="flex w-full h-[calc(100vh-117px)] justify-center">
          <div
            ref={chatContainer}
            class="overflow-y-scroll min-w-full w-full min-h-[calc(100vh-117px)] px-3 pt-20 relative scrollable-container chatbot-chat-view scroll-smooth">
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
                    />
                  )}
                  
                  {message.sourceDocuments && message.sourceDocuments.length && (
                    <div
                      style={{
                        display: 'flex',
                        'flex-direction': 'row',
                        width: '100%',
                      }}>
                      <For each={[...removeDuplicateURL(message)]}>
                        {(src) => {
                          const URL = isValidURL(src.metadata.source);
                          return (
                            <SourceBubble
                              pageContent={URL ? URL.pathname : src.pageContent}
                              metadata={src.metadata}
                              onSourceClick={() => {
                                if (URL) {
                                  window.open(src.metadata.source, '_blank');
                                } else {
                                  setSourcePopupSrc(src);
                                  setSourcePopupOpen(true);
                                }
                              }}
                            />
                          );
                        }}
                      </For>
                    </div>
                  )}
                </>
              )}
            </For>
          </div>
          <BottomSpacer ref={bottomSpacer} />
        </div>
      </div>
      <div class="chatbot-container p-4">
        {fileSended() ? (
          <TextInput
            disabled={isReplying() || loading()}
            backgroundColor={props.textInput?.backgroundColor}
            textColor={props.textInput?.textColor}
            placeholder={loading() ? 'Gerando resposta...' : props.textInput?.placeholder}
            sendButtonColor={props.textInput?.sendButtonColor}
            fontSize={props.fontSize}
            defaultValue={userInput()}
            onSubmit={handleSubmit}
          />
        ) : (
          <Button
            backgroundColor={props.buttonInput?.backgroundColor}
            textColor={props.buttonInput?.textColor}
            onSubmit={() => { setShowModal(true) }}
          >Enviar Laudo Médico</Button>

        )}
        <Badge badgeBackgroundColor={props.badgeBackgroundColor} poweredByTextColor={props.poweredByTextColor} botContainer={botContainer} />
      </div>
      {sourcePopupOpen() && <Popup isOpen={sourcePopupOpen()} value={sourcePopupSrc()} onClose={() => setSourcePopupOpen(false)} />}
      {showModal() && <Modal isOpen={showModal()} onClose={() => setShowModal(false)} >
        <UploadFileForm onSubmit={onUploadFormSubmit} buttonInput={props.buttonInput} />
      </Modal>}
    </>
  );
};

type BottomSpacerProps = {
  ref: HTMLDivElement | undefined;
};
const BottomSpacer = (props: BottomSpacerProps) => {
  return <div ref={props.ref} class="w-full h-32" />;
};
