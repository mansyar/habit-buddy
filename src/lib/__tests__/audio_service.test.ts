import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioService } from '../audio_service';
import { Audio } from 'expo-av';

vi.mock('expo-av', () => {
  const mockSound = {
    loadAsync: vi.fn().mockResolvedValue({ isLoaded: true }),
    unloadAsync: vi.fn().mockResolvedValue({ isLoaded: false }),
    playAsync: vi.fn().mockResolvedValue({ isPlaying: true }),
    pauseAsync: vi.fn().mockResolvedValue({ isPlaying: false }),
    stopAsync: vi.fn().mockResolvedValue({ isPlaying: false }),
    setIsLoopingAsync: vi.fn().mockResolvedValue({ isLooping: true }),
    setVolumeAsync: vi.fn().mockResolvedValue({ volume: 1 }),
    setStatusAsync: vi.fn().mockResolvedValue({}),
    setOnPlaybackStatusUpdate: vi.fn(),
  };

  const Sound = vi.fn(() => mockSound);
  // Add static createAsync to the Sound mock
  (Sound as any).createAsync = vi.fn().mockResolvedValue({ sound: mockSound });

  return {
    Audio: {
      Sound,
      setAudioModeAsync: vi.fn().mockResolvedValue({}),
    },
  };
});

describe('AudioService', () => {
  let mockSoundInstance: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    await audioService.reset();

    // Get the mockSound instance from the mock factory
    const { sound } = await (Audio.Sound as any).createAsync();
    mockSoundInstance = sound;

    // Clear mocks again because reset/createAsync might have called things
    Object.values(mockSoundInstance).forEach((mock) => {
      if (vi.isMockFunction(mock)) mock.mockClear();
    });
    vi.mocked(Audio.Sound.createAsync).mockClear();
  });

  it('should play a sound effect', async () => {
    const soundKey = 'tap';
    const mockFile = { uri: 'test-sfx.mp3' };

    await audioService.playSound(soundKey, mockFile);

    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(mockFile);
    expect(mockSoundInstance.playAsync).toHaveBeenCalled();
  });

  it('should play background music with looping', async () => {
    const musicKey = 'bg-music';
    const mockFile = { uri: 'test-music.mp3' };

    await audioService.playMusic(musicKey, mockFile);

    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(mockFile);
    expect(mockSoundInstance.setIsLoopingAsync).toHaveBeenCalledWith(true);
    expect(mockSoundInstance.playAsync).toHaveBeenCalled();
  });

  it('should stop and unload music', async () => {
    const musicKey = 'bg-music';
    const mockFile = { uri: 'test-music.mp3' };

    await audioService.playMusic(musicKey, mockFile);
    await audioService.stopMusic();

    expect(mockSoundInstance.stopAsync).toHaveBeenCalled();
    expect(mockSoundInstance.unloadAsync).toHaveBeenCalled();
  });

  it('should handle global mute', async () => {
    const soundKey = 'tap';
    const mockFile = { uri: 'test-sfx.mp3' };

    audioService.setMute(true);
    await audioService.playSound(soundKey, mockFile);

    expect(mockSoundInstance.setVolumeAsync).toHaveBeenCalledWith(0);

    audioService.setMute(false);
    await audioService.playSound(soundKey, mockFile);
    expect(mockSoundInstance.setVolumeAsync).toHaveBeenCalledWith(1);
  });

  it('should set global volume', async () => {
    audioService.setVolume(0.5);
    const soundKey = 'tap';
    const mockFile = { uri: 'test-sfx.mp3' };

    await audioService.playSound(soundKey, mockFile);

    expect(mockSoundInstance.setVolumeAsync).toHaveBeenCalledWith(0.5);
  });
});
