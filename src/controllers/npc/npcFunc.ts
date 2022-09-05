import { RecordTypesEnum } from "@/enums";
import logger from "@/logger";
import {
  ConnectNPC,
  StartRecordingPlayback,
  StopRecordingPlayback,
  PauseRecordingPlayback,
  ResumeRecordingPlayback,
  StartRecordingPlayerData,
  StopRecordingPlayerData,
} from "@/wrapper/functions";
import { BasePlayer } from "../player";

export enum ERecordStatus {
  none,
  start,
  pause,
}

export abstract class BaseNpcFunc {
  private static recordStatus: ERecordStatus;
  public static connectNPC = ConnectNPC;
  public static startRecordingPlayerData<P extends BasePlayer>(
    player: P,
    recordtype: RecordTypesEnum,
    recordname: string
  ): void {
    if (player.isRecording)
      return logger.warn(
        "[StartRecordingPlayerData]: It should be stopped before recording"
      );
    StartRecordingPlayerData(player.id, recordtype, recordname);
    player.isRecording = true;
  }
  public static stopRecordingPlayerData<P extends BasePlayer>(player: P): void {
    if (!player.isRecording)
      return logger.warn(
        "[StartRecordingPlayerData]: It should be started before stop"
      );
    StopRecordingPlayerData(player.id);
    player.isRecording = false;
  }
  public static startRecordingPlayback(
    playbacktype: RecordTypesEnum,
    recordname: string
  ): void {
    if (BaseNpcFunc.recordStatus >= ERecordStatus.start)
      return logger.warn(
        "[BaseNpcFunc]: The current status cannot be replayed"
      );
    StartRecordingPlayback(playbacktype, recordname);
    BaseNpcFunc.recordStatus = ERecordStatus.start;
  }
  public static stopRecordingPlayback(): void {
    if (BaseNpcFunc.recordStatus < ERecordStatus.start)
      return logger.warn("[BaseNpcFunc]: The current status cannot be stopped");
    StopRecordingPlayback();
    BaseNpcFunc.recordStatus = ERecordStatus.none;
  }

  public static pauseRecordingPlayback() {
    if (BaseNpcFunc.recordStatus !== ERecordStatus.start)
      return logger.warn("[BaseNpcFunc]: The current status cannot be paused");
    PauseRecordingPlayback();
    BaseNpcFunc.recordStatus = ERecordStatus.pause;
  }
  public static resumeRecordingPlayback() {
    if (BaseNpcFunc.recordStatus !== ERecordStatus.pause)
      return logger.warn("[BaseNpcFunc]: The current status cannot be paused");
    ResumeRecordingPlayback();
    BaseNpcFunc.recordStatus = ERecordStatus.start;
  }
}
