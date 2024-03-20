/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ParentProps } from 'solid-js';

type Props = ParentProps & {
  isOpen: boolean;
  onClose: () => void;
};

export const Modal = (props: Props) => {
  let ref: HTMLDivElement;

  const handleClick = (event: MouseEvent) => {
    if (!ref.contains(event.target as Node)) {
      props.onClose();
    }
  };

  return (
    <>
      {props.isOpen ? (
        <div class="modal-backdrop" onClick={handleClick}>
          <div ref={ref!} class="fixed modal">
            {props.children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
