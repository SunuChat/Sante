import React, { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

const AudioPlayer = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const audioRef = useRef(null);

    const handlePlayPause = () => {
        if (audioRef.current.paused || isStopped) {
            audioRef.current.play();
            setIsPlaying(true);
            setIsStopped(false);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleStop = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setIsStopped(true);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <audio ref={audioRef} src={audioUrl} />

            <IconButton onClick={handlePlayPause} disabled={!audioUrl}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={handleStop} disabled={!audioUrl}>
                <StopIcon />
            </IconButton>
        </Box>
    );
};

export default AudioPlayer;
