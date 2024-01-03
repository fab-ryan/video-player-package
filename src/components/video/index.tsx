import React, { useEffect, useState, MouseEvent } from 'react';
import {
  VideoContainer,
  Button,
  VideoControlsContainer,
  Controls,
  VolumeContainer,
  DurationContainer,
  TimelineContainer,
  Timeline,
  ThumbIndicator,
} from './styles';
import {
  HighVolume,
  LowerVolume,
  PauseIcon,
  Play,
  MutedVolume,
  FullScreenOpen,
  FullScreenExit,
  TheaterTallOpen,
  TheaterTallExit,
  MiniPlayer,
} from '../icons';

type TVolumeStatus = 'High' | 'Low' | 'Muted';

const Video: React.FC<IVideo> = ({ language, kind, videoSrc }: IVideo) => {
  const [isPaused, setIsPaused] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState<string | number>('00:00');
  const [totalTime, setTotalTime] = useState<string | number>('00:00');
  const [progressPosition, setProgressPosition] = useState(0);
  const [volumeStatus, setVolumeStatus] = useState<TVolumeStatus>('High');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tagName = (document.activeElement as Element).tagName.toLowerCase();

      if (tagName === 'input') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          togglePlay();
          break;
        case 'f':
          toggleFullScreenMode();
          break;
        case 't':
          toggleTheaterMode();
          break;
        case 'i':
          toggleMiniPlayerMode();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowleft':
        case 'j':
          skip(-5);
          break;
        case 'arrowright':
        case 'l':
          skip(5);
          break;
        case 'c':
          toggleCaptions();
          break;
        case 'arrowup':
          changeVolumeUp();
          break;

        case 'arrowdown':
          changeVolumeDown();
          break;
        default:
          break;
      }
    };

    const changeVolumeUp = () => {
      const video = videoRef.current;
      if (video) {
        video.volume += 0.1;
        setVolume(video.volume);
        video.muted = video.volume === 0;
        setIsMuted(video.volume === 0);
        handleChangeVolumeStatus(video.volume);
      }
    };

    const changeVolumeDown = () => {
      const video = videoRef.current;
      if (video) {
        video.volume -= 0.1;
        setVolume(video.volume);
        video.muted = video.volume === 0 || video.volume <= 0.1;
        setIsMuted(video.volume === 0 || video.volume <= 0.1);
        handleChangeVolumeStatus(video.volume);
      }
    };
    const handleTimeUpdate = () => {
      if (video) {
        setCurrentTime(formatDuration(video.currentTime));
        const percent = video.currentTime / video.duration;
        setProgressPosition(percent);
      }
    };

    const handleLoadedData = () => {
      if (video) {
        setTotalTime(formatDuration(video.duration));
      }
    };

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadeddata', handleLoadedData);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadeddata', handleLoadedData);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [formatDuration]);

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function formatDuration(time: number) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes,
      )}:${leadingZeroFormatter.format(seconds)}`;
    }
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      setIsPaused((prev) => {
        if (prev) {
          video.play();
        } else {
          video.pause();
        }
        return !prev;
      });
    }
  };

  const toggleFullScreenMode = () => {
    setIsFullScreen((prev) => {
      if (!prev) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      return !prev;
    });
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode((prev) => !prev);
  };

  const toggleMiniPlayerMode = () => {
    const video = videoRef.current;
    if (video) {
      setIsMiniPlayer((prev) => {
        if (!prev) {
          video.requestPictureInPicture();
        } else {
          document.exitPictureInPicture();
        }
        return !prev;
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setVolume(video.muted ? 0 : 1);
    }
    setIsMuted((prev) => !prev);
  };

  const handleChangeVolumeStatus = (newVolume: number) => {
    if (newVolume > 0.5) {
      setVolumeStatus('High');
    } else if (newVolume > 0) {
      setVolumeStatus('Low');
    } else {
      setVolumeStatus('Muted');
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      video.volume = newVolume;
      video.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
      handleChangeVolumeStatus(newVolume);
    }
  };

  const skip = (duration: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime += duration;
    }
  };

  const toggleCaptions = () => {
    const video = videoRef.current;
    if (video) {
      const captions = video.textTracks[0];
      const isHidden = captions.mode === 'hidden';
      captions.mode = isHidden ? 'showing' : 'hidden';
    }
  };

  const handleTimelineUpdate = (e: MouseEvent) => {
    const video = videoRef.current;
    if (video) {
      const timeline = e.currentTarget;
      const rect = timeline.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setPreviewPosition(percent);

      if (isScrubbing) {
        setProgressPosition(percent);
      }
    }
  };

  const handleToggleScrubbing = (e: MouseEvent) => {
    const video = videoRef.current;
    if (video) {
      const timeline = e.currentTarget;
      const rect = timeline.getBoundingClientRect();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const percent = Math.min(0, e.clientX - rect.x, rect.width) / rect.width;
      setIsScrubbing((e.buttons & 1) == 1);
      if (isScrubbing) {
        video.pause();
      } 
      handleTimelineUpdate(e);
    }
  };

  return (
    <VideoContainer
      className={`video-container ${isPaused ? 'paused' : ''}`}
      data-volume-level='high'
    >
      <VideoControlsContainer>
        <TimelineContainer onMouseMove={(e) => handleToggleScrubbing(e)}>
          <Timeline
            progressPosition={progressPosition}
            previewPosition={previewPosition}
            className='progress-bar'
            style={
              { '--progress': `${progressPosition}%` } as React.CSSProperties
            }
          >
            <ThumbIndicator progressPosition={progressPosition} />
          </Timeline>
        </TimelineContainer>
        <Controls>
          <Button
            className='play-pause-btn'
            onClick={togglePlay}
          >
            {isPaused ? <Play /> : <PauseIcon />}
          </Button>

          <VolumeContainer>
            <Button
              className='volume-button'
              onClick={toggleMute}
            >
              {isMuted ? (
                <MutedVolume />
              ) : volumeStatus === 'High' ? (
                <HighVolume />
              ) : volumeStatus === 'Low' ? (
                <LowerVolume />
              ) : (
                <LowerVolume />
              )}
            </Button>
            <input
              className='volume-slider'
              type='range'
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
            />
          </VolumeContainer>
          <DurationContainer>
            <div className='current-time'>{currentTime}</div>/
            <div className='total-time'>{totalTime}</div>
          </DurationContainer>

          <Button className='speed-btn wide-btn'>1x</Button>

          <Button
            className='full-screen-button'
            onClick={toggleMiniPlayerMode}
          >
            {isMiniPlayer ? <MiniPlayer /> : <MiniPlayer />}
          </Button>

          <Button
            className='full-screen-button'
            onClick={toggleTheaterMode}
          >
            {isTheaterMode ? <TheaterTallExit /> : <TheaterTallOpen />}
          </Button>

          <Button
            className='full-screen-button'
            onClick={toggleFullScreenMode}
          >
            {isFullScreen ? <FullScreenExit /> : <FullScreenOpen />}
          </Button>
        </Controls>
      </VideoControlsContainer>

      <video
        ref={videoRef}
        src={videoSrc}
      >
        {kind && (
          <track
            kind={kind}
            srcLang={language}
            src='assets/subtitles.vtt'
          />
        )}
      </video>
    </VideoContainer>
  );
};

export interface IVideo {
  videoSrc: string;
  videoTitle?: string;
  videoDescription?: string;
  kind?: string;
  language?: string;
}

export default Video;
