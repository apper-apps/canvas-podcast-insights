import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const YoutubePlayer = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return (
      <Card className="p-6">
        <div className="text-center text-slate-500">
          <ApperIcon name="AlertCircle" className="w-8 h-8 mx-auto mb-2" />
          <p>Invalid YouTube URL</p>
        </div>
      </Card>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium text-sm line-clamp-1">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(url, "_blank")}
            className="text-white hover:bg-white/10"
          >
            <ApperIcon name="ExternalLink" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isPlaying ? (
        <div className="relative bg-slate-100 aspect-video flex items-center justify-center">
          <Button
            onClick={() => setIsPlaying(true)}
            className="flex flex-col items-center gap-2 text-white bg-black/60 hover:bg-black/70 px-8 py-6 rounded-xl"
            size="lg"
          >
            <ApperIcon name="Play" className="w-12 h-12" />
            <span className="text-sm">Play Episode</span>
          </Button>
          
          <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
            YouTube Video
          </div>
        </div>
      ) : (
        <div className="youtube-container">
          <iframe
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
      
      <div className="p-4 bg-slate-50 border-t">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>20VC Podcast Episode</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
          >
            <ApperIcon name="Youtube" className="w-4 h-4" />
            Watch on YouTube
          </a>
        </div>
      </div>
    </Card>
  );
};

export default YoutubePlayer;