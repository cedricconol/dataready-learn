import React from "react";

interface Props {
  /** Full YouTube URL or bare video ID. Leave undefined/empty to render nothing. */
  url?: string;
}

function extractVideoId(url: string): string | null {
  // Already a bare ID (11 alphanumeric + _ -)
  if (/^[\w-]{11}$/.test(url)) return url;

  try {
    const parsed = new URL(url);
    // https://www.youtube.com/watch?v=VIDEO_ID
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
    // https://youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("?")[0] || null;
    }
    // https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = parsed.pathname.match(/\/embed\/([\w-]{11})/);
    if (embedMatch) return embedMatch[1];
  } catch {
    // fall through
  }
  return null;
}

export default function YouTubeEmbed({ url }: Props): JSX.Element | null {
  if (!url) return null;

  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return (
    <div className="youtube-embed-wrapper">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
