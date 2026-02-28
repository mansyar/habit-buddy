import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioService } from '../audio_service';
import { createAudioPlayer } from 'expo-audio';

// Mock expo-audio
vi.mock('expo-audio', () => {
  const mockPlayer = {
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    remove: vi.fn(),
    addListener: vi.fn(() => ({ remove: vi.fn() })),
    volume: 1,
    loop: false,
  };
  return {
    createAudioPlayer: vi.fn(() => mockPlayer),
    AudioModule: {},
  };
});

describe('AudioService', () => {
  let mockPlayerInstance: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    await audioService.reset();

    mockPlayerInstance = vi.mocked(createAudioPlayer)({ uri: 'test' });
    vi.mocked(createAudioPlayer).mockClear();
  });

  it('should play a sound effect', async () => {
    const soundKey = 'tap';
    const mockFile = { uri: 'test-sfx.mp3' };

    await audioService.playSound(soundKey, mockFile);

    expect(createAudioPlayer).toHaveBeenCalledWith(mockFile);
    expect(mockPlayerInstance.play).toHaveBeenCalled();
  });

  it('should play background music with looping', async () => {
    const musicKey = 'bg-music';
    const mockFile = { uri: 'test-music.mp3' };

    await audioService.playMusic(musicKey, mockFile);

    expect(createAudioPlayer).toHaveBeenCalledWith(mockFile);
    expect(mockPlayerInstance.loop).toBe(true);
    expect(mockPlayerInstance.play).toHaveBeenCalled();
  });

  it('should stop and remove music', async () => {
    const musicKey = 'bg-music';
    const mockFile = { uri: 'test-music.mp3' };

    await audioService.playMusic(musicKey, mockFile);
    await audioService.stopMusic();

    expect(mockPlayerInstance.remove).toHaveBeenCalled();
  });

  it('should handle global mute', async () => {
    const soundKey = 'tap';
    const mockFile = { uri: 'test-sfx.mp3' };

    audioService.setMute(true);
    await audioService.playSound(soundKey, mockFile);

    expect(mockPlayerInstance.volume).toBe(0);

    audioService.setMute(false);
    await audioService.playSound(soundKey, mockFile);
    expect(mockPlayerInstance.volume).toBe(1);
  });

  it('should set global volume', async () => {
    audioService.setVolume(0.5);
    const soundKey = 'tap';
    const mockFile = { uri: 'test-sfx.mp3' };

    await audioService.playSound(soundKey, mockFile);

    expect(mockPlayerInstance.volume).toBe(0.5);
  });

  it('should reset service', async () => {
    await audioService.reset();
    expect(mockPlayerInstance.remove).toHaveBeenCalled();
  });
});
