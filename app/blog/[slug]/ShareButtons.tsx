'use client';

import { Share2, Linkedin, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex gap-2">
      <button
        className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
        onClick={handleTwitterShare}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
        onClick={handleLinkedInShare}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </button>
      <button
        className="p-2 rounded-full bg-muted hover:bg-accent transition-colors"
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
