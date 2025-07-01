const { Readable } = require("stream");

class AudioUtils {
  static createReadableStream(buffer) {
    const readable = new Readable({
      read() {},
    });
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  static calculateAudioDuration(
    buffer,
    sampleRate = 48000,
    channels = 2,
    bytesPerSample = 2
  ) {
    const totalSamples = buffer.length / (channels * bytesPerSample);
    return (totalSamples / sampleRate) * 1000;
  }

  static trimSilence(buffer, threshold = 500) {
    // simple silence trimming - remove very quiet parts at the beginning and end
    const samples = new Int16Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / 2
    );

    let start = 0;
    let end = samples.length - 1;

    // find start of audio (skip initial silence)
    while (start < samples.length && Math.abs(samples[start]) < threshold) {
      start++;
    }

    // find end of audio (skip trailing silence)
    while (end > start && Math.abs(samples[end]) < threshold) {
      end--;
    }

    if (start >= end) {
      return Buffer.alloc(0); // all silence
    }

    // convert back to buffer
    const trimmedSamples = samples.slice(start, end + 1);
    return Buffer.from(trimmedSamples.buffer);
  }

  static normalizeVolume(buffer, targetVolume = 0.8) {
    const samples = new Int16Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / 2
    );

    // find peak amplitude
    let peak = 0;
    for (let i = 0; i < samples.length; i++) {
      peak = Math.max(peak, Math.abs(samples[i]));
    }

    if (peak === 0) return buffer; // avoid division by zero

    // calculate scaling factor
    const maxValue = 32767; // max value for 16-bit audio
    const currentVolume = peak / maxValue;
    const scaleFactor = targetVolume / currentVolume;

    // apply scaling (but prevent clipping)
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.max(-32768, Math.min(32767, samples[i] * scaleFactor));
    }

    return Buffer.from(samples.buffer);
  }

  static detectVoiceActivity(buffer, threshold = 1000, windowSize = 1024) {
    const samples = new Int16Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / 2
    );

    // calculate RMS energy in windows
    let hasVoice = false;

    for (let i = 0; i < samples.length - windowSize; i += windowSize) {
      let sum = 0;
      for (let j = i; j < i + windowSize; j++) {
        sum += samples[j] * samples[j];
      }

      const rms = Math.sqrt(sum / windowSize);

      if (rms > threshold) {
        hasVoice = true;
        break;
      }
    }

    return hasVoice;
  }

  static mixAudioBuffers(buffers, weights = null) {
    if (!buffers.length) return Buffer.alloc(0);

    // use equal weights if not provided
    if (!weights) {
      weights = new Array(buffers.length).fill(1.0 / buffers.length);
    }

    // find the longest buffer to determine output length
    const maxLength = Math.max(...buffers.map((buf) => buf.length));
    const output = new Int16Array(maxLength / 2);

    // mix all buffers
    for (let i = 0; i < buffers.length; i++) {
      const samples = new Int16Array(
        buffers[i].buffer,
        buffers[i].byteOffset,
        buffers[i].byteLength / 2
      );
      const weight = weights[i];

      for (let j = 0; j < samples.length; j++) {
        output[j] = Math.max(
          -32768,
          Math.min(32767, output[j] + samples[j] * weight)
        );
      }
    }

    return Buffer.from(output.buffer);
  }
}

module.exports = AudioUtils;
