import { Button } from '@/components/inputs/button'
import { ButtonInputTheme } from '@/features/bubble/types'
import { For } from 'solid-js'
import { UploadFile, createFileUploader } from '@solid-primitives/upload'

type Props = {
    onSubmit: (files: UploadFile[]) => void
    buttonInput?: ButtonInputTheme
}

export const UploadFileForm = (props: Props) => {
    const { files, selectFiles } = createFileUploader({ accept: "application/pdf" });

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
                accept="application/pdf"
                multiple
                onClick={(event) => {
                    event.preventDefault()
                    selectFiles(files => files.forEach(file => console.log(file)));
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