import { StarIcon } from '@/components/icons/StarIcon'
import { onCleanup, onMount } from 'solid-js'

type Props = {
  botContainer: HTMLDivElement | undefined
  poweredByTextColor?: string
  badgeBackgroundColor?: string
}

const defaultTextColor = '#303235'

export const Badge = (props: Props) => {
  let liteBadge: HTMLAnchorElement | undefined
  let observer: MutationObserver | undefined

  const appendBadgeIfNecessary = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((removedNode) => {
        if (
          'id' in removedNode &&
          liteBadge &&
          removedNode.id == 'lite-badge'
        ) {
          console.log("Sorry, you can't remove the brand 😅")
          props.botContainer?.append(liteBadge)
        }
      })
    })
  }

  onMount(() => {
    if (!document || !props.botContainer) return
    observer = new MutationObserver(appendBadgeIfNecessary)
    observer.observe(props.botContainer, {
      subtree: false,
      childList: true,
    })
  })

  onCleanup(() => {
    if (observer) observer.disconnect()
  })

return (
  <span
    style={{
      "font-size": "13px",
      position: "absolute",
      bottom: 0,
      padding: "10px 12px",
      margin: "auto",
      width: "100%",
      "text-align": "center",
      color: props.poweredByTextColor ?? defaultTextColor,
      "background-color": props.badgeBackgroundColor ?? "#ffffff",
      display: "flex",
      "justify-content": "space-between",
    }}
  >
    <span style={{ display: "flex", "align-items": "center" }}>
      Powered by
      <a
        href={"https://www.startse.com/"}
        target="_blank"
        rel="noopener noreferrer"
        class="lite-badge"
        id="lite-badge"
        style={{
          "font-weight": "bold",
          color: props.poweredByTextColor ?? defaultTextColor,
          "margin-left": "3px",
        }}
      >
        <span>StartSe</span>
      </a>
    </span>

    <button
      onClick={() => {
        window.open("https://forms.gle/KYeCx3PWUpozpMjQ9", "_blank");
      }}
      style={{
        border: "2px solid #303235",
        "border-radius": "5px",
        padding: "12.5px",
        display: "flex",
        "align-items": "center",
        cursor: "pointer",
      }}
    >
      <StarIcon />
      <span
        style={{ "margin-left": "5px" }}>Avalie o A.IChef</span>
    </button>
  </span>
);

};

