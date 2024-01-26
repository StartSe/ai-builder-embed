import { Show } from 'solid-js'
import { Avatar } from '../avatars/Avatar'
import { LoadingIcon } from '../icons/LoadingIcon'

type Props = {
  showAvatar?: boolean
  avatarSrc?: string
  backgroundColor?: string
  textColor?: string
}

const defaultBackgroundColor = '#f7f8ff'
const defaultTextColor = '#303235'

export const LoadingFileBubble = (props: Props) => {
  return (
    <div
      class="flex justify-start mb-2 items-start host-container"
      style={{ 'margin-right': '50px' }}
    >
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
      <span
        class="px-4 py-4 ml-2 whitespace-pre-wrap max-w-full chatbot-host-bubble flex flex-col gap-2 items-center justify-center text-center"
        data-testid="host-bubble"
        style={{ "background-color": props.backgroundColor ?? defaultBackgroundColor, color: props.textColor ?? defaultTextColor, 'border-radius': '6px' }}
      >
        <div class="chatbot-loading-icon-animation"><LoadingIcon /></div>

        Estamos quase lá! Por favor, aguarde enquanto preparamos o resumo do seu laudo médico...
      </span>
    </div>
  )
}
