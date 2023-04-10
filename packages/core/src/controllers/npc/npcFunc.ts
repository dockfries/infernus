import { ERecordStatus, RecordTypesEnum } from "@/enums";
import { logger } from "@/logger";
import {
  ConnectNPC,
  StartRecordingPlayback,
  StopRecordingPlayback,
  PauseRecordingPlayback,
  ResumeRecordingPlayback,
  StartRecordingPlayerData,
  StopRecordingPlayerData,
} from "@/wrapper/native/functions";
import { Player } from "../player";

export class NpcFunc {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  private static recordStatus: ERecordStatus;
  static readonly connectNPC = ConnectNPC;
  static startRecordingPlayerData<P extends Player>(
    player: P,
    recordtype: RecordTypesEnum,
    recordname: string
  ): void {
    if (player.isRecording)
      return logger.warn("[NpcFunc]: It should be stopped before recording");
    StartRecordingPlayerData(player.id, recordtype, recordname);
    player.isRecording = true;
  }
  static stopRecordingPlayerData<P extends Player>(player: P): void {
    if (!player.isRecording)
      return logger.warn("[NpcFunc]: It should be started before stop");
    StopRecordingPlayerData(player.id);
    player.isRecording = false;
  }
  static startRecordingPlayback(
    playbacktype: RecordTypesEnum,
    recordname: string
  ): void {
    if (NpcFunc.recordStatus >= ERecordStatus.start)
      return logger.warn("[NpcFunc]: The current status cannot be replayed");
    StartRecordingPlayback(playbacktype, recordname);
    NpcFunc.recordStatus = ERecordStatus.start;
  }
  static stopRecordingPlayback(): void {
    if (NpcFunc.recordStatus < ERecordStatus.start)
      return logger.warn("[NpcFunc]: The current status cannot be stopped");
    StopRecordingPlayback();
    NpcFunc.recordStatus = ERecordStatus.none;
  }

  static pauseRecordingPlayback() {
    if (NpcFunc.recordStatus !== ERecordStatus.start)
      return logger.warn("[NpcFunc]: The current status cannot be paused");
    PauseRecordingPlayback();
    NpcFunc.recordStatus = ERecordStatus.pause;
  }
  static resumeRecordingPlayback() {
    if (NpcFunc.recordStatus !== ERecordStatus.pause)
      return logger.warn("[NpcFunc]: The current status cannot be paused");
    ResumeRecordingPlayback();
    NpcFunc.recordStatus = ERecordStatus.start;
  }
}
