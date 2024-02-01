import { Button } from '@/components/inputs/button'
import { ButtonInputTheme } from '@/features/bubble/types'
import { For } from 'solid-js'
import { UploadFile, createFileUploader } from '@solid-primitives/upload'

type Props = {
    onSubmit: (files: UploadFile[]) => void
    buttonInput?: ButtonInputTheme
}

export const UploadFileForm = (props: Props) => {
    const { files, selectFiles } = createFileUploader({ accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps" });

    const onSubmit = (event: MouseEvent) => {
        event.preventDefault()
        props.onSubmit(files())
    }

    return <form class='flex flex-col justify-center items-center gap-0.75'>
        <div class='flex flex-col justify-center items-center gap-6'>
            <h2 class="modal-title">
                Faça o upload do seu Laudo Médico
            </h2>

            <input
                type='file'
                name="upload"
                accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                multiple
                onClick={(event) => {
                    event.preventDefault()
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    selectFiles(files => files.forEach(() => {}));
                  }}
            />
            <For each={files()}>{item => <p>{item.name}</p>}</For>
        </div>

        <Button
            onSubmit={onSubmit}
            backgroundColor={props.buttonInput?.backgroundColor}
            textColor={props.buttonInput?.textColor}
            disabled={files()?.length === 0}
        >
            Enviar Arquivos
        </Button>
    </form>
}