import {useEffect, useRef} from 'react';
import {useRouter} from 'next/router';
import GrowFrame, {updateGrowFrameHeight} from '../src/components/GrowFrame';

export default function AppEmulator() {
  const {query} = useRouter();
  const stringifiedQuery = new URLSearchParams(
    query as Record<string, string>,
  ).toString();
  const iframeSrc = `/playroom/preview/?${stringifiedQuery}`;
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const messageListener = (e: any) => {
      // TODO filter so we only log messages from app-bridge;
      // NOTE: There are other postMessage events coming in (eg; from
      // <GrowFrame>)
      if (e.source?.frameElement === frameRef?.current) {
        console.log(e);
      }
    };
    // We listen in to window.top here
    // Because appbridge posts all messages to
    // window.top https://developer.mozilla.org/en-US/docs/Web/API/Window/top
    // This app-emulator is itself an iframe inside of the polaris docs site
    // this iFrame is not the top.
    window.top!.addEventListener('message', messageListener);
    return () => {
      return window.top!.removeEventListener('message', messageListener);
    };
  }, []);
  return (
    <>
      <GrowFrame
        ref={frameRef}
        id="app-iframe"
        style={{
          display: 'block',
          resize: 'horizontal',
          overflow: 'auto',
          width: '100%',
          maxWidth: '100%',
          minWidth: '375px',
        }}
        defaultHeight="400px"
        src={iframeSrc}
        onContentLoad={() => {
          updateGrowFrameHeight(`${document.body.scrollHeight}px`);
        }}
      />
    </>
  );
}
