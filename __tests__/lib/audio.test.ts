import { playKeySound, playErrorSound, playCompleteSound } from "@/lib/audio";

function createMockOscillator() {
  return {
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    frequency: { value: 0 },
    type: "sine",
  };
}

function createMockGain() {
  return {
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  };
}

beforeEach(() => {
  jest.resetModules();
  const mockCtx = {
    state: "running" as AudioContextState,
    resume: jest.fn().mockResolvedValue(undefined),
    currentTime: 0,
    destination: {},
    createOscillator: jest.fn(() => createMockOscillator()),
    createGain: jest.fn(() => createMockGain()),
  };
  (global as any).AudioContext = jest.fn(() => mockCtx);
});

describe("audio", () => {
  describe("playKeySound", () => {
    it("creates oscillator and gain, connects and plays", async () => {
      const { playKeySound: play } = await import("@/lib/audio");
      play();
      const AudioContextMock = (global as any).AudioContext;
      const mockCtx = AudioContextMock.mock.results[0].value;
      expect(mockCtx.createOscillator).toHaveBeenCalled();
      expect(mockCtx.createGain).toHaveBeenCalled();
    });
  });

  describe("playErrorSound", () => {
    it("creates sawtooth oscillator", async () => {
      const { playErrorSound: play } = await import("@/lib/audio");
      play();
      const AudioContextMock = (global as any).AudioContext;
      const mockCtx = AudioContextMock.mock.results[0].value;
      const osc = mockCtx.createOscillator.mock.results[0].value;
      expect(osc.type).toBe("sawtooth");
      expect(osc.frequency.value).toBe(180);
    });
  });

  describe("playCompleteSound", () => {
    it("plays three notes sequentially", async () => {
      const { playCompleteSound: play } = await import("@/lib/audio");
      play();
      const AudioContextMock = (global as any).AudioContext;
      const mockCtx = AudioContextMock.mock.results[0].value;
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(3);
      expect(mockCtx.createGain).toHaveBeenCalledTimes(3);
    });

    it("sets different frequencies for each note", async () => {
      const { playCompleteSound: play } = await import("@/lib/audio");
      play();
      const AudioContextMock = (global as any).AudioContext;
      const mockCtx = AudioContextMock.mock.results[0].value;
      const oscillators = mockCtx.createOscillator.mock.results.map(
        (r: any) => r.value
      );
      expect(oscillators[0].frequency.value).toBe(523);
      expect(oscillators[1].frequency.value).toBe(659);
      expect(oscillators[2].frequency.value).toBe(784);
    });
  });
});
