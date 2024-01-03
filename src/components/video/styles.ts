import styled from 'styled-components';

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-inline: auto;
  background-color: black;

  &.theater,
  &.full-screen {
    max-width: initial;
    width: 100%;
  }

  &.theater {
    max-height: 90vh;
  }

  &.full-screen {
    max-height: 100vh;
  }
`;

export const VideoControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  z-index: 100;
  opacity: 0;
  width: 100%;
  transition: opacity 150ms ease-in-out;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
    width: 100%;
    aspect-ratio: 6 / 1;
    z-index: -1;
    pointer-events: none;
  }

  ${VideoContainer}:hover &,
  ${VideoContainer}:focus-within &,
  ${VideoContainer}.paused & {
    opacity: 1;
  }
`;

export const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  align-items: center;
`;

export const Button = styled.button`
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  height: 30px;
  width: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 150ms ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

export const Timeline = styled.div<{ progressPosition: number, previewPosition:number }>`
  background-color: rgba(100, 100, 100, 0.5);
  height: 3px;
  width: 100%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: calc(100% - ${(props) => props.progressPosition || 0} * 100%);
    background-color: red;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: calc(100% - ${(props) => props.previewPosition || 0} * 100%);
    background-color: rgb(150, 150, 150);
    display: none;
  }
`;

export const ThumbIndicator = styled.div<{ progressPosition: number }>`
  --scale: 0;
  position: absolute;
  transform: translateX(-50%) scale(var(--scale));
  height: 200%;
  top: -50%;
  left: calc(${(props) => props.progressPosition || 0} * 100%);
  background-color: red;
  border-radius: 50%;
  transition: transform 150ms ease-in-out;
  aspect-ratio: 1 / 1;
`;

export const PreviewImg = styled.img<{ previewPosition: number }>`
  position: absolute;
  height: 80px;
  aspect-ratio: 16 / 9;
  top: -1rem;
  transform: translate(-50%, -100%);
  left: calc(${(props) => props.previewPosition || 0} * 100%);
  border-radius: 0.25rem;
  border: 2px solid white;
  display: none;
`;

export const VolumeContainer = styled.div`
  display: flex;
  align-items: center;

  .volume-slider {
    width: 0;
    transform-origin: left;
    transform: scaleX(0);
    transition: width 150ms ease-in-out, transform 150ms ease-in-out;
  }

  &:hover .volume-slider,
  .volume-slider:focus-within {
    width: 100px;
    transform: scaleX(1);
  }
`;

export const DurationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-grow: 1;
`;

export const TimelineContainer = styled.div`
  height: 7px;
  margin-inline: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    ${Timeline}::before {
      display: block;
    }
    ${ThumbIndicator} {
      --scale: 2;
    }
    ${PreviewImg} {
      display: block;
    }
  }
`;
