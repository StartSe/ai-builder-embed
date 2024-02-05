import { DeleteIcon } from "@/components/icons/DeleteIcon"
import { UploadFile } from "@solid-primitives/upload"

type Props = {
    file: UploadFile,
    onDelete: () => void
}

export const UploadFileItem = (props: Props) => {
    return <div class="flex items-center justify-between upload-file-item">
        <p>{props.file.name}</p>
        <div onClick={() => props.onDelete()} style={{ cursor: 'pointer' }}>
            <DeleteIcon />
        </div>
    </div>
}