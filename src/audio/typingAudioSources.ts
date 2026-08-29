import humanTypingUrl from '../assets/audio/human-typing.mp3'
import aiGeneration01Url from '../assets/audio/ai-generation-01.wav'
import aiGeneration02Url from '../assets/audio/ai-generation-02.wav'
import aiGeneration03Url from '../assets/audio/ai-generation-03.wav'
import aiGeneration04Url from '../assets/audio/ai-generation-04.wav'
import aiGeneration05Url from '../assets/audio/ai-generation-05.wav'

/**
 * The only place runtime audio URLs are declared. All sources are bundled,
 * content-hashed Vite assets; no absolute or machine-specific paths exist at
 * runtime.
 */
export const TYPING_AUDIO_SOURCES = {
  human: humanTypingUrl,
  ai: [
    aiGeneration01Url,
    aiGeneration02Url,
    aiGeneration03Url,
    aiGeneration04Url,
    aiGeneration05Url,
  ],
} as const
