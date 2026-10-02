/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HymnItem } from '../data/hymnsCatalogData';

export type HymnVoiceSection =
  | 'intro'
  | 'stanza-0'
  | 'chorus-1'
  | 'stanza-1'
  | 'chorus-2'
  | 'stanza-2'
  | 'chorus-final'
  | 'complete';

export interface VoicePlayCallbacks {
  onSectionStart?: (section: HymnVoiceSection, label: string) => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export interface VoiceSettings {
  rate: number; // 0.8 to 1.2
  pitch: number; // 0.9 to 1.1
  volume: number; // 0.0 to 1.0
  voiceURI?: string;
  repeatChorusBetweenStanzas: boolean;
  announceTitle: boolean;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  rate: 0.94, // Solemn reverent pace
  pitch: 1.0,
  volume: 1.0,
  repeatChorusBetweenStanzas: true,
  announceTitle: true,
};

class HymnVoiceEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private queue: Array<{ text: string; section: HymnVoiceSection; label: string }> = [];
  private isRunning = false;
  private isPaused = false;
  private currentSection: HymnVoiceSection | null = null;
  private callbacks: VoicePlayCallbacks = {};
  private settings: VoiceSettings = { ...DEFAULT_VOICE_SETTINGS };

  public getAvailableSpanishVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    const all = window.speechSynthesis.getVoices() || [];
    // Prioritize Spanish voices
    const spanish = all.filter((v) =>
      v.lang.toLowerCase().startsWith('es') ||
      v.name.toLowerCase().includes('spanish') ||
      v.name.toLowerCase().includes('español')
    );
    if (spanish.length > 0) return spanish;
    return all;
  }

  public getPreferredSpanishVoice(): SpeechSynthesisVoice | null {
    const list = this.getAvailableSpanishVoices();
    if (list.length === 0) return null;

    // Check if user set a custom voiceURI
    if (this.settings.voiceURI) {
      const found = list.find((v) => v.voiceURI === this.settings.voiceURI);
      if (found) return found;
    }

    // Try natural, neural, or regional Spanish voices first
    const preferredOrder = [
      (v: SpeechSynthesisVoice) => v.lang.toLowerCase().includes('es-co'), // Colombia (San Gil)
      (v: SpeechSynthesisVoice) => v.lang.toLowerCase().includes('es-419'), // Latin America
      (v: SpeechSynthesisVoice) => v.lang.toLowerCase().includes('es-mx'), // Mexico
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('natural'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('sabina'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('monica'),
      (v: SpeechSynthesisVoice) => v.name.toLowerCase().includes('google'),
      (v: SpeechSynthesisVoice) => v.lang.toLowerCase().startsWith('es'),
    ];

    for (const matcher of preferredOrder) {
      const match = list.find(matcher);
      if (match) return match;
    }

    return list[0];
  }

  public updateSettings(partial: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...partial };
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public getCurrentSection(): HymnVoiceSection | null {
    return this.currentSection;
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  public isPausedState(): boolean {
    return this.isPaused;
  }

  public stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.queue = [];
    this.currentSection = null;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  public pause() {
    if (typeof window !== 'undefined' && window.speechSynthesis && this.isRunning) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && window.speechSynthesis && this.isRunning) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  /**
   * Speak a specific excerpt immediately (e.g. user clicked on a specific Stanza or Chorus)
   */
  public speakSingleSnippet(
    text: string,
    section: HymnVoiceSection,
    label: string,
    callbacks?: VoicePlayCallbacks
  ) {
    this.stop();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    this.isRunning = true;
    this.isPaused = false;
    this.currentSection = section;
    this.callbacks = callbacks || {};

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getPreferredSpanishVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'es-ES';
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    utterance.onstart = () => {
      this.callbacks.onSectionStart?.(section, label);
    };

    utterance.onend = () => {
      this.isRunning = false;
      this.currentSection = null;
      this.callbacks.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isRunning = false;
      this.currentSection = null;
      this.callbacks.onError?.(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Reads the entire hymn devotionally: Title & Reference -> Stanza 1 -> Chorus -> Stanza 2 -> Chorus -> Stanza 3 -> Chorus Final
   */
  public speakFullHymn(hymn: HymnItem, callbacks?: VoicePlayCallbacks) {
    this.stop();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    this.isRunning = true;
    this.isPaused = false;
    this.callbacks = callbacks || {};

    const queue: Array<{ text: string; section: HymnVoiceSection; label: string }> = [];

    // 1. Intro: Title and Biblical Reference
    if (this.settings.announceTitle) {
      const cleanTitle = hymn.title.replace(/\(.*?\)/g, '').trim();
      const introText = `Himno número ${hymn.formattedNumber}. ${cleanTitle}. ${hymn.scriptureRef}.`;
      queue.push({
        text: introText,
        section: 'intro',
        label: `Introducción: Himno #${hymn.formattedNumber}`,
      });
    }

    // 2. Stanza 1
    if (hymn.stanzas[0]) {
      queue.push({
        text: hymn.stanzas[0],
        section: 'stanza-0',
        label: 'Estrofa I',
      });
    }

    // 3. Chorus after Stanza 1
    if (hymn.chorus) {
      queue.push({
        text: `Coro: ${hymn.chorus}`,
        section: 'chorus-1',
        label: 'Coro Congregacional',
      });
    }

    // 4. Stanza 2
    if (hymn.stanzas[1]) {
      queue.push({
        text: hymn.stanzas[1],
        section: 'stanza-1',
        label: 'Estrofa II',
      });

      if (this.settings.repeatChorusBetweenStanzas && hymn.chorus) {
        queue.push({
          text: `Coro: ${hymn.chorus}`,
          section: 'chorus-2',
          label: 'Coro Congregacional',
        });
      }
    }

    // 5. Stanza 3
    if (hymn.stanzas[2]) {
      queue.push({
        text: hymn.stanzas[2],
        section: 'stanza-2',
        label: 'Estrofa III',
      });
    }

    // 6. Final Chorus
    if (hymn.chorus) {
      queue.push({
        text: `Coro final: ${hymn.chorus}`,
        section: 'chorus-final',
        label: 'Coro Final',
      });
    }

    this.queue = queue;
    this.processNextInQueue();
  }

  private processNextInQueue() {
    if (!this.isRunning) return;
    if (this.queue.length === 0) {
      this.isRunning = false;
      this.currentSection = 'complete';
      this.callbacks.onEnd?.();
      return;
    }

    const item = this.queue.shift()!;
    this.currentSection = item.section;

    const utterance = new SpeechSynthesisUtterance(item.text);
    const voice = this.getPreferredSpanishVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'es-ES';
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    utterance.onstart = () => {
      this.callbacks.onSectionStart?.(item.section, item.label);
    };

    utterance.onend = () => {
      if (this.isRunning) {
        // Small solemn breath pause between stanzas
        window.setTimeout(() => {
          this.processNextInQueue();
        }, 350);
      }
    };

    utterance.onerror = (e) => {
      // If user skipped or cancelled, ignore
      if (!this.isRunning) return;
      this.callbacks.onError?.(e);
      // Try next
      this.processNextInQueue();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const hymnVoiceEngine = new HymnVoiceEngine();
