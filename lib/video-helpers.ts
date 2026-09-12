export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  platform?: 'youtube' | 'instagram' | 'local';
  highlight?: boolean;
  category?: string;
  badge?: string;
}

export interface PosterItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  year?: string;
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function getInstagramCode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

export function detectPlatform(url: string): 'youtube' | 'instagram' | 'local' {
  if (!url) return 'local';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('instagram.com')) return 'instagram';
  return 'local';
}

export function getVideoThumbnail(item: VideoItem): string {
  if (item.thumbnail && item.thumbnail.trim() !== '') {
    return item.thumbnail;
  }
  const ytId = getYouTubeVideoId(item.url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return '/jpg/sachin-1.jpeg';
}

export function normalizeVideo(item: VideoItem | string, index: number): VideoItem {
  if (typeof item === 'string') {
    const platform = detectPlatform(item);
    let title = `Video ${index + 1}`;
    if (platform === 'youtube') title = `YouTube Feature ${index + 1}`;
    else if (platform === 'instagram') title = `Instagram Reel ${index + 1}`;
    
    return {
      id: `vid-${index}`,
      title,
      url: item,
      platform,
      highlight: index < 6,
      category: platform === 'youtube' ? 'YouTube' : platform === 'instagram' ? 'Reel' : 'Storytelling',
    };
  }
  return {
    ...item,
    platform: item.platform || detectPlatform(item.url),
    highlight: typeof item.highlight === 'boolean' ? item.highlight : index < 6,
  };
}
