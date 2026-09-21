type IconProps = { size?: number; strokeWidth?: number };

const paths = {
  activity: <><path d="M3 12h4l2-7 4 14 2-7h6" /></>,
  arrowLeft: <><path d="m15 18-6-6 6-6" /><path d="M9 12h12" /></>,
  arrowRight: <><path d="m9 18 6-6-6-6" /><path d="M3 12h12" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  chevronRight: <><path d="m9 18 6-6-6-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 20h16" /></>,
  flame: <><path d="M12 21c4.2 0 7-2.8 7-6.6 0-3-1.9-5.5-4.7-7.6.2 2-1 3.4-2.2 4.1.2-3.4-1.7-6-4-7.9.3 3.5-3.1 5.6-3.1 9.8C5 18 7.8 21 12 21Z" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l3 2" /></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" /><path d="M9 21v-6h6v6" /></>,
  moon: <><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <><path d="M5 12h14" /></>,
  pause: <><path d="M8 5v14M16 5v14" /></>,
  play: <><path d="m8 5 11 7-11 7Z" /></>,
  rotate: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></>,
  settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.5h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.5v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.5H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 20h16" /></>,
  dumbbell: <><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12" /></>,
  shield: <><path d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z" /><path d="m9 12 2 2 4-4" /></>,
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, strokeWidth = 1.8 }: IconProps & { name: IconName }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}
