import type { RecordTypesEnum } from "core/enums";

export const StartRecordingPlayback = (
  playbackType: RecordTypesEnum,
  recordName: string
): void => {
  return samp.callNative(
    "StartRecordingPlayback",
    "is",
    playbackType,
    recordName
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
