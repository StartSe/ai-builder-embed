import { Show } from 'solid-js'
import { Avatar } from '../avatars/Avatar'
import { Marked } from '@ts-stack/markdown'
import { UploadFile } from '@solid-primitives/upload'
import { PdfIcon } from '../icons/PdfIcon'

type Props = {
  message: UploadFile
  showAvatar?: boolean
  avatarSrc?: string
  backgroundColor?: string
  textColor?: string
}

const defaultBackgroundColor = '#3B81F6'
const defaultTextColor = '#ffffff'

Marked.setOptions({ isNoP: true })

export const FileBubble = (props: Props) => {

  return (
    <div
      class="flex justify-end mb-2 items-end guest-container"
      style={{ 'margin-left': '50px' }}
    >
      <span
        class="px-4 py-2 mr-2 whitespace-pre-wrap max-w-full chatbot-guest-bubble chatbot-file-bubble flex"
        data-testid="guest-bubble"
        style={{
          "background-color": props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
          'border-radius': '5px',
          
        }}
      > <PdfIcon /> {props.message.name}</span>
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
    </div>
  )
}
