import "./styles.css";
import { useCallback, useEffect, useRef } from "react";
import { DailyProvider, useCallFrame } from "@daily-co/daily-react";

export const Prebuilt = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Musician joins via a link ending in ?musician=1
  const isMusician =
    new URLSearchParams(window.location.search).get("musician") === "1";

  const callFrame = useCallFrame({
    // @ts-expect-error will be fixed in the next release
    parentElRef: wrapperRef,
    options: {
      url: "https://YOUR-DOMAIN.daily.co/YOUR-ROOM", // replace with your own room
      dailyConfig: {
        useDevicePreferenceCookies: true,
        // Music mode only for the musician; listeners get the default voice mode
        ...(isMusician ? { micAudioMode: "music" as const } : {}),
      },
      iframeStyle: {
        width: "100%",
        height: "80vh",
      },
      userData: {
        avatar: "https://www.svgrepo.com/show/532036/cloud-rain-alt.svg",
      },
    },
    shouldCreateInstance: useCallback(() => Boolean(wrapperRef.current), []),
  });

  useEffect(() => {
    if (!callFrame) return;
    callFrame.join().catch((err) => {
      console.error("Error joining call", err);
    });
  }, [callFrame]);

  return (
    <DailyProvider callObject={callFrame}>
      <div ref={wrapperRef} />
    </DailyProvider>
  );
};
