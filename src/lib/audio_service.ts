import { createAudioPlayer, AudioSource } from 'expo-audio';

class AudioService {
  private musicPlayer: any = null;
  private sfxPlayers: Map<string, any> = new Map();
  private volume: number = 1.0;
  private isMuted: boolean = false;

  async init() {
    // AudioModule settings if needed, expo-audio handles most platform defaults
  }

  async playSound(key: string, source: AudioSource) {
    try {
      if (this.sfxPlayers.has(key)) {
        const existingPlayer = this.sfxPlayers.get(key);
        existingPlayer.remove();
      }

      const player = createAudioPlayer(source);
      this.sfxPlayers.set(key, player);

      player.volume = this.isMuted ? 0 : this.volume;
      player.play();

      // Listen for playback completion to clean up
      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          player.remove();
          this.sfxPlayers.delete(key);
          subscription.remove();
        }
      });
    } catch (error) {
      console.error('AudioService: Error playing SFX', error);
    }
  }

  async playMusic(key: string, source: AudioSource) {
    try {
      if (this.musicPlayer) {
        this.musicPlayer.remove();
      }

      this.musicPlayer = createAudioPlayer(source);
      this.musicPlayer.loop = true;
      this.musicPlayer.volume = this.isMuted ? 0 : this.volume * 0.5;
      this.musicPlayer.play();
    } catch (error) {
      console.error('AudioService: Error playing music', error);
    }
  }

  async stopMusic() {
    if (this.musicPlayer) {
      this.musicPlayer.remove();
      this.musicPlayer = null;
    }
  }

  async reset() {
    await this.stopMusic();
    for (const player of this.sfxPlayers.values()) {
      player.remove();
    }
    this.sfxPlayers.clear();
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

  private updateVolumes() {
    const currentVolume = this.isMuted ? 0 : this.volume;
    if (this.musicPlayer) {
      this.musicPlayer.volume = currentVolume * 0.5;
    }
    for (const player of this.sfxPlayers.values()) {
      player.volume = currentVolume;
    }
  }
}

export const audioService = new AudioService();
