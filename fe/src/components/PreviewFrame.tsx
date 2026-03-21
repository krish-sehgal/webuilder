import { useEffect, useState } from "react";
import type { WebContainer } from "@webcontainer/api";

interface PreviewFrameProps {
  webContainer: WebContainer;
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {

  const [url, setUrl] = useState("");
  const [installProgress, setInstallProgress] = useState("");

  async function main() {
    try {
      const installProcess = await webContainer.spawn('npm', ['install']);

      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          setInstallProgress(data);
        }
      }));

      const exitCode = await installProcess.exit;

      if (exitCode !== 0) {
        console.error('Install failed with exit code:', exitCode);
        return;
      }

      await webContainer.spawn('npm', ['run', 'dev']);

      webContainer.on('server-ready', (_port, url) => {
        setUrl(url);
      })
    } catch (error) {
      console.log('error:', error);
    }
  }

  useEffect(() => {
    if (!webContainer) return
    main()
  }, [webContainer])

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">Dependency installation may take your 5 minutes, take a glass of water</p>
        <p className="text-sm text-gray-500">{installProgress}</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  )
}
