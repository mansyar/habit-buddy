import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioService } from '../audio_service';
import { createAudioPlayer } from 'expo-audio';

vi.mock('expo-audio', () => {
  const createMockPlayer = () => {
    let volumeVal = 1;
    const mock = {
      play: vi.fn(),
      pause: vi.fn(),
      stop: vi.fn(),
      remove: vi.fn(),
      addListener: vi.fn((event, callback) => {
        if (event === 'playbackStatusUpdate') {
          mock._lastCallback = callback;
        }
        return { remove: vi.fn() };
      }),
      _lastCallback: null as any,
      loop: false,
      set volume(v: number) {
        volumeVal = v;
      },
      get volume() {
        return volumeVal;
      },
    };
    return mock;
  };
  return {
    createAudioPlayer: vi.fn(createMockPlayer),
    AudioModule: {},
  };
});

describe('AudioService', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await audioService.reset();
  });

  it('should play SFX and cleanup on finish', async () => {
    const source = { uri: 'test.mp3' };
    await audioService.playSound('tap', source);

    // Get the most recently created mock player
    const lastMock = vi.mocked(createAudioPlayer).mock.results[0].value;
    expect(createAudioPlayer).toHaveBeenCalledWith(source);

    // Trigger playback finish
    const callback = lastMock._lastCallback;
    expect(callback).toBeDefined();

    callback({ didJustFinish: true });
    expect(lastMock.remove).toHaveBeenCalled();
  });

  it('should handle layered audio (BGM + multiple SFX) and mute all', async () => {
    const bgmSource = { uri: 'bgm.mp3' };
    const sfx1Source = { uri: 'sfx1.mp3' };
    const sfx2Source = { uri: 'sfx2.mp3' };

    await audioService.playMusic('main', bgmSource);
    const bgmPlayer = vi.mocked(createAudioPlayer).mock.results[0].value;

    await audioService.playSound('sfx1', sfx1Source);
    const sfx1Player = vi.mocked(createAudioPlayer).mock.results[1].value;

    await audioService.playSound('sfx2', sfx2Source);
    const sfx2Player = vi.mocked(createAudioPlayer).mock.results[2].value;

    // Initial volumes (music at 0.5, sfx at 1.0)
    expect(bgmPlayer.volume).toBe(0.5);
    expect(sfx1Player.volume).toBe(1.0);
    expect(sfx2Player.volume).toBe(1.0);

    // Mute while playing
    audioService.setMute(true);
    expect(bgmPlayer.volume).toBe(0);
    expect(sfx1Player.volume).toBe(0);
    expect(sfx2Player.volume).toBe(0);

    // Unmute
    audioService.setMute(false);
    expect(bgmPlayer.volume).toBe(0.5);
    expect(sfx1Player.volume).toBe(1.0);
    expect(sfx2Player.volume).toBe(1.0);

    // Adjust global volume
    audioService.setVolume(0.8);
    expect(bgmPlayer.volume).toBe(0.4); // 0.8 * 0.5
    expect(sfx1Player.volume).toBe(0.8);
    expect(sfx2Player.volume).toBe(0.8);
  });

  it('should replace active SFX with same key', async () => {
    const key = 'tap';
    await audioService.playSound(key, { uri: 'sfx1.mp3' });
    const p1 = vi.mocked(createAudioPlayer).mock.results[0].value;

    await audioService.playSound(key, { uri: 'sfx2.mp3' });
    const p2 = vi.mocked(createAudioPlayer).mock.results[1].value;

    expect(p1.remove).toHaveBeenCalled();
    expect(p2.play).toHaveBeenCalled();
  });

  it('should replace active Music with same key', async () => {
    await audioService.playMusic('m1', { uri: 'm1.mp3' });
    const p1 = vi.mocked(createAudioPlayer).mock.results[0].value;

    await audioService.playMusic('m1', { uri: 'm2.mp3' });
    const p2 = vi.mocked(createAudioPlayer).mock.results[1].value;

    expect(p1.remove).toHaveBeenCalled();
    expect(p2.play).toHaveBeenCalled();
  });
});
