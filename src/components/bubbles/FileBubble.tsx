import { Show, onMount, createMemo } from 'solid-js'
import { Avatar } from '../avatars/Avatar'
import { Marked } from '@ts-stack/markdown'
import { UploadFile } from '@solid-primitives/upload'
import { PdfIcon } from '../icons/PdfIcon'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import { ImageIcon } from '../icons/ImageIcon'

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
  GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.mjs'

  let el!: HTMLCanvasElement;

  onMount(async () => {
    if (!el.getContext) return

    const canvasContext = el.getContext("2d") as CanvasRenderingContext2D
    if (props.message.name.toLowerCase().includes('.pdf')) {
      const pdfFile = await getDocument(await props.message.file.arrayBuffer()).promise

      const page = await pdfFile.getPage(1);
      const ratio = canvasContext.canvas.width / page.getViewport({scale: 1}).width
      const viewport = page.getViewport({ scale: ratio });

      const renderTask = page.render({
        viewport,
        canvasContext
      });
      await renderTask.promise;
    } else {
      const img = new Image()
      img.onload = function () {
        const ratio = canvasContext.canvas.width / img.width
        canvasContext.drawImage(img, 0, 0, img.width*ratio, img.height*ratio);
      }

      img.src = props.message.source;
    }
  })

  const icon = createMemo(() => props.message.name.includes('.pdf') ? <PdfIcon /> : <ImageIcon />)

  return (
    <div
      class="flex flex-col justify-end mb-2 items-end guest-container"
      style={{ 'margin-left': '50px' }}
    >
      <canvas ref={el} class="mr-2" width={304} height={138} 
        style={{"border-radius": '5px 5px 0px 0px'}}
      />
      <span
        class="px-4 py-2 mr-2 whitespace-pre-wrap max-w-full chatbot-guest-bubble chatbot-file-bubble flex"
        data-testid="guest-bubble"
        style={{
          "background-color": props.backgroundColor ?? defaultBackgroundColor,
          color: props.textColor ?? defaultTextColor,
        }}
      > {icon()} {props.message.name}</span>
      <Show when={props.showAvatar}>
        <Avatar initialAvatarSrc={props.avatarSrc} />
      </Show>
    </div>
  )
}
