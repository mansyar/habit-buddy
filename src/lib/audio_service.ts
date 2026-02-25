import { Audio, AVPlaybackStatus, AVPlaybackStatusToSet } from 'expo-av';

class AudioService {
  private musicSound: Audio.Sound | null = null;
  private sfxSounds: Map<string, Audio.Sound> = new Map();
  private volume: number = 1.0;
  private isMuted: boolean = false;

  async init() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldRouteThroughEarpieceAndroid: false,
    });
  }

  async playSound(key: string, source: any) {
    try {
      // For SFX, we might want multiple overlapping sounds, but for now
      // let's just reuse or create a new one per key.
      if (this.sfxSounds.has(key)) {
        const sound = this.sfxSounds.get(key);
        await sound?.stopAsync();
        await sound?.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(source);
      this.sfxSounds.set(key, sound);
      await sound.setVolumeAsync(this.isMuted ? 0 : this.volume);
      await sound.playAsync();

      // Clean up when finished
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          this.sfxSounds.delete(key);
        }
      });
    } catch (error) {
      console.error('AudioService: Error playing SFX', error);
    }
  }

  async playMusic(key: string, source: any) {
    try {
      if (this.musicSound) {
        await this.musicSound.stopAsync();
        await this.musicSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(source);
      this.musicSound = sound;
      await sound.setIsLoopingAsync(true);
      await sound.setVolumeAsync(this.isMuted ? 0 : this.volume * 0.5); // Music usually quieter
      await sound.playAsync();
    } catch (error) {
      console.error('AudioService: Error playing music', error);
    }
  }

  async stopMusic() {
    if (this.musicSound) {
      await this.musicSound.stopAsync();
      await this.musicSound.unloadAsync();
      this.musicSound = null;
    }
  }

  async reset() {
    await this.stopMusic();
    for (const sound of this.sfxSounds.values()) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    this.sfxSounds.clear();
    this.volume = 1.0;
    this.isMuted = false;
  }

  setVolume(volume: number) {
    this.volume = volume;
    this.updateVolumes();
  }

  setMute(isMuted: boolean) {
    this.isMuted = isMuted;
    this.updateVolumes();
  }

  private async updateVolumes() {
    const currentVolume = this.isMuted ? 0 : this.volume;
    if (this.musicSound) {
      await this.musicSound.setVolumeAsync(currentVolume * 0.5);
    }
    for (const sound of this.sfxSounds.values()) {
      await sound.setVolumeAsync(currentVolume);
    }
  }
}

export const audioService = new AudioService();
