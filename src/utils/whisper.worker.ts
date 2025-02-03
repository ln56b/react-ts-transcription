import { pipeline, Pipeline } from "@xenova/transformers";
import { MessageTypes } from "./presets";

type LoadModelCallback = {
  status: string;
  file: string;
  loaded: number;
  name: string;
  progress: number;
  total: number;
};

class MyTranscriptionPipeline {
  static model = "Xenova/whisper-tiny.en";
  static instance: Pipeline | null = null;

  static async getInstance(
    progress_callback: (data: LoadModelCallback) => void
  ): Promise<Pipeline> {
    if (this.instance === null) {
      this.instance = await pipeline(
        "automatic-speech-recognition",
        this.model,
        {
          progress_callback,
        }
      );
    }

    return this.instance;
  }
}

self.addEventListener("message", async (event) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.REQUEST) {
    await transcribe(audio);
  }
});

async function transcribe(audio: Float32Array<ArrayBufferLike>) {
  sendLoadingMessage("LOADING");

  let pipeline: Pipeline | null = null;

  try {
    pipeline = await MyTranscriptionPipeline.getInstance(loadingModelCallback);
  } catch (err) {
    console.warn("Error in chunkCallback", err.message);
  }

  sendLoadingMessage("SUCCESS");

  const stride_length_s = 5;

  if (!pipeline) {
    return;
  }
  const generationTracker = new GenerationTracker(pipeline, stride_length_s);

  await pipeline(audio, {
    top_k: 0,
    do_sample: false,
    chunk_length_s: 30,
    stride_length_s,
    return_timestamps: true,
    callback_function:
      generationTracker.callbackFunction.bind(generationTracker),
    chunk_callback: generationTracker.chunkCallback.bind(generationTracker),
  });
  generationTracker.sendFinalResult();
}

async function loadingModelCallback(data: LoadModelCallback): Promise<void> {
  if (data.status === "progress") {
    sendDownloadingMessage(data);
  }
}

function sendLoadingMessage(status: string): void {
  self.postMessage({
    type: MessageTypes.LOADING,
    status,
  });
}

async function sendDownloadingMessage(data: LoadModelCallback): Promise<void> {
  const { file, progress, loaded, total } = data;
  self.postMessage({
    type: MessageTypes.DOWNLOADING,
    file,
    progress,
    loaded,
    total,
  });
}

class GenerationTracker {
  pipeline: Pipeline;
  stride_length_s: number;
  chunks: any[];
  time_precision: number;
  processed_chunks: any[];
  callbackFunctionCounter: number;

  constructor(pipeline: Pipeline, stride_length_s: number) {
    this.pipeline = pipeline;
    this.stride_length_s = stride_length_s;
    this.chunks = [];
    this.time_precision =
      pipeline?.processor.feature_extractor.config.chunk_length /
      pipeline.model.config.max_source_positions;
    this.processed_chunks = [];
    this.callbackFunctionCounter = 0;
  }

  sendFinalResult() {
    self.postMessage({ type: MessageTypes.DONE });
  }

  callbackFunction(beams) {
    this.callbackFunctionCounter += 1;
    if (this.callbackFunctionCounter % 10 !== 0) {
      return;
    }

    const bestBeam = beams[0];
    const text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
      skip_special_tokens: true,
    });

    const result = {
      text,
      start: this.getLastChunkTimestamp(),
      end: undefined,
    };

    createPartialResultMessage(result);
  }

  chunkCallback(data) {
    this.chunks.push(data);

    try {
      const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
        this.chunks,
        {
          time_precision: this.time_precision,
          return_timestamps: true,
          force_full_sequence: false,
        }
      );

      this.processed_chunks = chunks.map((chunk, index: number) => {
        return this.processChunk(chunk, index);
      });

      createResultMessage(
        this.processed_chunks,
        false,
        this.getLastChunkTimestamp()
      );
    } catch (error) {
      console.warn("Error in chunkCallback", error.message);
    }
  }

  getLastChunkTimestamp() {
    if (this.processed_chunks.length === 0) {
      return 0;
    }
  }

  processChunk(chunk: any, index: number) {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;

    return {
      index,
      text: `${text.trim()}`,
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
    };
  }
}

function createResultMessage(
  results: any[],
  isDone: boolean,
  completedUntilTimestamp?: number
) {
  self.postMessage({
    type: MessageTypes.RESULT,
    results,
    isDone,
    completedUntilTimestamp,
  });
}

function createPartialResultMessage(result: {
  text: string;
  start?: number;
  end?: number;
}) {
  self.postMessage({
    type: MessageTypes.RESULT_PARTIAL,
    result,
  });
}
