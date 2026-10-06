import { ref } from 'vue'

const toastMessage = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

export function useClipboard() {
  const isCopied = ref(false)

  async function copyToClipboard(text: string, label: string = 'Copied to clipboard!') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for non-secure or restricted contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }

      isCopied.value = true
      toastMessage.value = label

      if (toastTimer) clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        toastMessage.value = null
        isCopied.value = false
      }, 2200)

      return true
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      toastMessage.value = 'Failed to copy to clipboard'
      if (toastTimer) clearTimeout(toastTimer)
      toastTimer = setTimeout(() => {
        toastMessage.value = null
      }, 2200)
      return false
    }
  }

  return {
    isCopied,
    toastMessage,
    copyToClipboard,
  }
}
