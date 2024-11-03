import * as w from "core/wrapper/native";
import type { RecordTypesEnum } from "../../enums";
import { ERecordStatus } from "../../enums";
import type { Player } from "../player";

export class Npc {
  private constructor() {
    throw new Error("This is a static class and cannot be instantiated.");
  }
  private static recordStatus: ERecordStatus;
  static readonly connect = w.ConnectNPC;
  static startRecordingPlayerData(
    player: Player,
    recordtype: RecordTypesEnum,
    recordname: string,
  ): void {
    if (player.isRecording)
      throw new Error("[NpcFunc]: It should be stopped before recording");
    w.StartRecordingPlayerData(player.id, recordtype, recordname);
    player.isRecording = true;
  }
  static stopRecordingPlayerData(player: Player): void {
    if (!player.isRecording)
      throw new Error("[NpcFunc]: It should be started before stop");
    w.StopRecordingPlayerData(player.id);
    player.isRecording = false;
  }
  static startRecordingPlayback(
    playbacktype: RecordTypesEnum,
    recordname: string,
  ): void {
    if (Npc.recordStatus >= ERecordStatus.start)
      throw new Error("[NpcFunc]: The current status cannot be replayed");
    w.StartRecordingPlayback(playbacktype, recordname);
    Npc.recordStatus = ERecordStatus.start;
  }
  static stopRecordingPlayback(): void {
    if (Npc.recordStatus < ERecordStatus.start)
      throw new Error("[NpcFunc]: The current status cannot be stopped");
    w.StopRecordingPlayback();
    Npc.recordStatus = ERecordStatus.none;
  }

  static pauseRecordingPlayback() {
    if (Npc.recordStatus !== ERecordStatus.start)
      throw new Error("[NpcFunc]: The current status cannot be paused");
    w.PauseRecordingPlayback();
    Npc.recordStatus = ERecordStatus.pause;
  }
  static resumeRecordingPlayback() {
    if (Npc.recordStatus !== ERecordStatus.pause)
      throw new Error("[NpcFunc]: The current status cannot be paused");
    w.ResumeRecordingPlayback();
    Npc.recordStatus = ERecordStatus.start;
  }
}
