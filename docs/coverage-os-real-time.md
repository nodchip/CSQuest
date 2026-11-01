# OS-Real-time：項目別の対応状況

原典：[CS2023](https://ieeecs-media.computer.org/media/education/reports/CS2023.pdf) 印字 pp.214–215。[追跡方法](coverage-status.md)に従い、６トピックと４例示学習成果を個別に記録する。模型の攻略は実機での設計・安全性や自由な説明を直接評価しない。

## トピック

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | KA Core | プロセス・仕事のスケジューリング | 部分 | 133で２仕事の実行順、134で優先度継承、757で周期優先と期限優先の12刻を比較。一般的な到着・方針や実 OS は未評価。 |
| 2 | KA Core | 期限とリアルタイムの問題 | 部分 | 133で完了時刻、420で周期基準と超過、757で周期的な仕事の期限を比較。実際の保証や一般の時間制約は未評価。 |
| 3 | KA Core | 低遅延、ソフト・ハードリアルタイム | 部分 | 133で期限超過、760で平均・期限超過・有限観察の限界と３種類の要件を比較。一般の実例や実機は未評価。 |
| 4 | Non-core | リアルタイム環境でのメモリ・ディスク管理要件 | 部分 | 758で事前取寄せと頁の固定、記憶の圧迫後の期限を比較。実際のメモリ・ディスク管理や一般の期限保証は未評価。 |
| 5 | Non-core | 故障、リスクと復旧 | 部分 | 395で検知不能時の停止判断、752で装置復旧、759で監視期間と再起動開始の時間を比較。実際の復旧と期限保証は未評価。 |
| 6 | Non-core | 安全性を含む特有の配慮 | 部分 | 395で検知から停止までの距離と遮蔽時の判断を操作。実機の危険分析や安全保証は未評価。 |

## 例示学習成果

| 番号 | 区分 | 要約 | 状態 | 体験と残る範囲 |
|---|---|---|---|---|
| 1 | KA Core | リアルタイムシステムの特徴を説明 | 部分 | 133で期限内の順序、760で期限の要件と平均速度を比較。体系的な説明や自由記述は未評価。 |
| 2 | KA Core | 遅延の原因と性質を説明 | 部分 | 134で鍵待ち、420で周期のずれ、758で頁の取寄せ時間を比較。原因全体、実測や自由記述は未評価。 |
| 3 | KA Core | リスクを含む特有の配慮と対策を説明 | 部分 | 395で遮蔽時に止まるかを選び、759で監視の早さと誤検知を比較。一般のリスク分析や自由記述は未評価。 |
| 4 | Non-core | 特定のリアルタイム OS の機能・仕組みを説明 | 部分 | 761で FreeRTOS の切替え設定と協調方式の譲渡を固定例で比較。実 OS の設定・実行と自由記述は未評価。 |

依頼133・134の期限と優先度の固定例は [OS-Real-time](os-real-time.md) を参照。依頼420は３刻周期と３仕事の長さを固定し、終了後の相対待機と基準時刻への待機、最初の仕事が周期を超える場合を比較する。依頼395の停止距離・遮蔽時の仮定は [SPD-Robot](spd-robot.md) を参照。関連検査は `tests/deadlines.test.js`、`tests/inversion.test.js`、`tests/periodic-timing.test.js`、`tests/robot-safety.test.js`。実測や一般的な期限保証ではない。

依頼757は [CMU の優先方式](https://www.cs.cmu.edu/~UniCon/reference-manual/Reference_Manual_62.html) と [Linux の期限スケジューリング](https://docs.kernel.org/6.1/scheduler/sched-deadline.html) を参考に、Ａ＝周期４・仕事２、Ｂ＝周期６・仕事３を単一 CPU・切替え費用０で12刻実行する。各仕事の期限は次の到着時刻。固定優先は AABBAABBAABB で最初のＢが時刻６に１刻残り、期限順は AABBBAABAABB で12刻までの期限を守る。`tests/realtime-schedule.test.js` で両順序、期限、途中記録と不正操作を照合。期限超過後も仕事を残す固定模型で、一般の負荷や実システムの期限を保証しない。

依頼758は [Linux の mlock の説明](https://man7.org/linux/man-pages/man2/mlockall.2.html) と [Linux のジッター低減](https://docs.kernel.org/timers/no_hz.html) を参考に、１枠の頁を事前に取り寄せて固定する場合と、準備なし・固定なしを比較する。準備の後に別頁が枠を求め、固定なしは退避、固定ありは別頁が待つという固定規則。取寄せ３刻・処理１刻・期限３刻で、合図後はそれぞれ４・４・１刻。`tests/realtime-memory.test.js` で３準備と履歴を検査する。固定操作の成功・費用０を仮定し、実機の遅延、権限・上限、他のフォールトや期限の保証は評価しない。

依頼759は [Linux の watchdog API](https://docs.kernel.org/6.10/watchdog/watchdog-api.html) と [ロックアップ検知](https://docs.kernel.org/admin-guide/lockup-watchdogs.html) を参考に、６刻までの進捗と合図、３・５刻の期限を比較する固定模型。停止時は時刻３・５に再起動を開始し、４刻かかる正常な仕事は３刻で誤検知、５刻なら継続する。見張り自身の毎刻の合図では停止を検知できない。独立した仕掛けで水門が閉じるのは模型の仮定で、watchdog や再起動自体が安全状態を保証することはない。`tests/watchdog-recovery.test.js` で全６場面と復元を検査する。

依頼760は [CMU のリアルタイムシステムの分類](https://users.ece.cmu.edu/~koopman/des_s99/real_time/) と [Linux の最悪遅延の説明](https://docs.kernel.org/next/core-api/real-time/kernel-configuration.html) を参考に、固定の応答列１・１・１・５と３・３・３・３を比較する。平均２・３に対し、期限３刻の超過は１・０回。ハード・ソフト・期限要件なしの架空の仕事を分類し、４件の観察から将来の上限を保証しないことを扱う。`tests/latency-deadline.test.js` で平均・期限・分類・復元を検査する。実性能や期限保証は評価しない。

依頼761は [FreeRTOS のタスクスケジューリング](https://github.freertos.org/Documentation/02-Kernel/02-Kernel-features/01-Tasks-and-co-routines/04-Task-scheduling) と [FreeRTOS の協調方式](https://www.freertos.org/media/2018/161204_Mastering_the_FreeRTOS_Real_Time_Kernel-A_Hands-On_Tutorial_Guide.pdf) を参考に、低い仕事４刻、高い仕事１刻・時刻２に実行可能、単一 CPU・切替え費用０を仮定する。プリエンプションありと協調方式で時刻２に譲る例では高い仕事は３刻に終了し、譲らない場合は低い仕事が終了し待機に移る時刻４から実行して５刻に終了する。`tests/freertos-preemption.test.js` で実行順と履歴を検査。実際の RTOS の実行・割込み遅延・他のタスクや期限保証は評価しない。
