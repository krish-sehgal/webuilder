import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react"

let webContainerInstance: WebContainer | null = null

function useWebContainer() {
  const [webContainer, setWebContainer] = useState<WebContainer>();

  async function main() {
    if (!webContainerInstance) {
      webContainerInstance = await WebContainer.boot();
    }
    setWebContainer(webContainerInstance);
  }

  useEffect(() => {
    main();
  }, [])

  return webContainer
}

export default useWebContainer
