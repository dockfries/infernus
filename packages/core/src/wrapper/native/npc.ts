import type { RecordTypesEnum } from "core/enums";

export const StartRecordingPlayback = (
  playbacktype: RecordTypesEnum,
  recordname: string
): void => {
  return samp.callNative(
    "StartRecordingPlayback",
    "is",
    playbacktype,
    recordname
  );
};

export const StopRecordingPlayback = (): void => {
  return samp.callNative("StopRecordingPlayback", "");
};

export const PauseRecordingPlayback = (): void => {
  return samp.callNative("PauseRecordingPlayback", "");
};

export const ResumeRecordingPlayback = (): void => {
  return samp.callNative("ResumeRecordingPlayback", "");
};
