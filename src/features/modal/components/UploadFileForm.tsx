import { Button } from '@/components/inputs/button';
import { ButtonInputTheme } from '@/features/bubble/types';
import { For, createSignal } from 'solid-js';
import { UploadFile, createFileUploader, createDropzone } from '@solid-primitives/upload';
import { UploadIcon } from '@/components/icons/UploadIcon';
import { UploadFileItem } from './UploadFileItem';

type Props = {
  onSubmit: (files: UploadFile[]) => void;
  formats: string[];
  buttonInput?: ButtonInputTheme;
};

export const UploadFileForm = (props: Props) => {
  const [files, setFiles] = createSignal<UploadFile[]>([]);
  const { selectFiles, clearFiles: selectClearFiles } = createFileUploader({ accept: props.formats.join(',') });

  const { setRef: dropzoneRef, clearFiles: dropzoneClearFiles } = createDropzone({
    onDrop: (files) => {
      setFiles(files);
    },
  });

  const clearFiles = () => {
    selectClearFiles();
    dropzoneClearFiles();
    setFiles([]);
  };

  const onSubmit = (event: MouseEvent) => {
    event.preventDefault();
    props.onSubmit(files());
  };

  return (
    <form class="flex flex-col justify-center items-center gap-8">
      <div class="flex flex-col justify-center items-center gap-6">
        <h2 class="modal-title">Faça o upload do seu arquivo</h2>

        <div ref={dropzoneRef} class="dropzone flex  justify-center items-center">
          <div class="flex flex-col justify-center items-center gap-2">
            <UploadIcon />
            <div>
              <h3>
                Arraste & solte arquivos ou{' '}
                <a
                  style={{
                    color: props.buttonInput?.backgroundColor,
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    selectFiles((files) => {
                      setFiles(files);
                    });
                  }}
                >
                  Escolha
                </a>
              </h3>
              <p>Formatos suportados: PDF, DOCX, TXT</p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          {files().length > 0 && <h4 class="upload-message">Fazendo upload do documento</h4>}
          <For each={files()}>{(item) => <UploadFileItem file={item} onDelete={clearFiles} />}</For>
        </div>
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
  );
};
