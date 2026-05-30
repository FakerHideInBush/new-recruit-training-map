"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, ClipboardCopy, Download, RotateCcw, Upload, UserPlus } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import { storageKey as oldProgressKey, trainingWeeks, type TrainingText } from "@/lib/training-content";

type WeekProgress = {
  checked: boolean[];
  blockers: boolean[];
  notes: string;
  completed: boolean;
};

type AppProgress = {
  recruitName: string;
  weeks: Record<string, WeekProgress>;
};

type TraineeProfile = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Status = "Not Started" | "In Progress" | "Completed";
type ImportMode = "current" | "new";

const profilesKey = "newRecruitTrainingMap:v1:profiles";
const activeProfileKey = "newRecruitTrainingMap:v1:activeProfileId";
const migratedKey = "newRecruitTrainingMap:v1:migrated";
const progressKey = (profileId: string) => `newRecruitTrainingMap:v1:profile:${profileId}:progress`;

function emptyWeekProgress(weekId: string): WeekProgress {
  const week = trainingWeeks.find((item) => item.id === weekId);
  return {
    checked: week?.checklist.map(() => false) ?? [],
    blockers: week?.blockers.map(() => false) ?? [],
    notes: "",
    completed: false,
  };
}

function emptyProgress(recruitName = ""): AppProgress {
  return {
    recruitName,
    weeks: Object.fromEntries(trainingWeeks.map((week) => [week.id, emptyWeekProgress(week.id)])),
  };
}

function normalizeProgress(input: unknown, fallbackName = ""): AppProgress {
  const base = emptyProgress(fallbackName);
  if (!input || typeof input !== "object") return base;

  const maybeApp = input as Partial<AppProgress>;
  const rawWeeks =
    maybeApp.weeks && typeof maybeApp.weeks === "object"
      ? maybeApp.weeks
      : (input as Record<string, Partial<WeekProgress> | undefined>);

  return {
    recruitName: typeof maybeApp.recruitName === "string" && maybeApp.recruitName.trim() ? maybeApp.recruitName : fallbackName,
    weeks: Object.fromEntries(
      trainingWeeks.map((week) => {
        const raw = (rawWeeks as Record<string, Partial<WeekProgress> | undefined>)[week.id];
        const checked = week.checklist.map((_, index) => Boolean(raw?.checked?.[index]));
        return [
          week.id,
          {
            checked,
            blockers: week.blockers.map((_, index) => Boolean(raw?.blockers?.[index])),
            notes: typeof raw?.notes === "string" ? raw.notes : "",
            completed: Boolean(raw?.completed) || checked.every(Boolean),
          },
        ];
      }),
    ),
  };
}

function readJson<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function createProfileRecord(name: string): TraineeProfile {
  const now = new Date().toISOString();
  const id = `profile_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  return { id, name: name.trim(), createdAt: now, updatedAt: now };
}

function safeProfileName(name: string) {
  return name.trim() || "未命名 Trainee";
}

function statusLabel(progress: WeekProgress): Status {
  if (progress.completed) return "Completed";
  if (progress.checked.some(Boolean) || progress.blockers.some(Boolean) || progress.notes.trim()) return "In Progress";
  return "Not Started";
}

function statusZh(status: Status) {
  if (status === "Completed") return "已完成";
  if (status === "In Progress") return "进行中";
  return "未开始";
}

function selectedTexts(options: TrainingText[], selected: boolean[]) {
  return options.filter((_, index) => selected[index]);
}

function cnList(items: TrainingText[]) {
  return items.map((item) => item.zh).join("；");
}

function percent(completed: number, total: number) {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

export function TrainingMap() {
  const [profiles, setProfiles] = useState<TraineeProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState("");
  const [progress, setProgress] = useState<AppProgress>(() => emptyProgress());
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [newProfileName, setNewProfileName] = useState("");
  const [importText, setImportText] = useState("");
  const [importMode, setImportMode] = useState<ImportMode>("current");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(() => new Set(["week-1"]));

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;

  useEffect(() => {
    const savedProfiles = readJson<TraineeProfile[]>(profilesKey, []).filter(
      (profile) => profile && typeof profile.id === "string" && typeof profile.name === "string",
    );
    let nextProfiles = savedProfiles;
    let nextActiveId = window.localStorage.getItem(activeProfileKey) ?? "";

    if (nextProfiles.length > 0 && !window.localStorage.getItem(migratedKey)) {
      const oldRaw = window.localStorage.getItem(oldProgressKey);
      if (oldRaw && !window.localStorage.getItem(progressKey(nextProfiles[0].id))) {
        try {
          const migrated = normalizeProgress(JSON.parse(oldRaw), nextProfiles[0].name);
          migrated.recruitName = migrated.recruitName || nextProfiles[0].name;
          window.localStorage.setItem(progressKey(nextProfiles[0].id), JSON.stringify(migrated));
          window.localStorage.setItem(migratedKey, "true");
        } catch {
          // Keep the old global data untouched if it cannot be parsed.
        }
      } else {
        window.localStorage.setItem(migratedKey, "true");
      }
    }

    if (!nextProfiles.some((profile) => profile.id === nextActiveId)) {
      nextActiveId = nextProfiles[0]?.id ?? "";
    }

    setProfiles(nextProfiles);
    setActiveProfileId(nextActiveId);
    if (nextActiveId) {
      const profile = nextProfiles.find((item) => item.id === nextActiveId);
      setProgress(normalizeProgress(readJson(progressKey(nextActiveId), null), profile?.name ?? ""));
      window.localStorage.setItem(activeProfileKey, nextActiveId);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !activeProfileId) return;
    window.localStorage.setItem(progressKey(activeProfileId), JSON.stringify(progress));
  }, [activeProfileId, loaded, progress]);


  const totals = useMemo(() => {
    const totalItems = trainingWeeks.reduce((sum, week) => sum + week.checklist.length, 0);
    const completedItems = trainingWeeks.reduce((sum, week) => sum + progress.weeks[week.id].checked.filter(Boolean).length, 0);
    const completedWeeks = trainingWeeks.filter((week) => progress.weeks[week.id].completed).length;
    const overallPercent = percent(completedItems, totalItems);
    const currentWeek = trainingWeeks.find((week) => !progress.weeks[week.id].completed) ?? null;
    const selectedBlockers = trainingWeeks.flatMap((week) =>
      selectedTexts(week.blockers, progress.weeks[week.id].blockers).map((blocker) => ({ week, blocker })),
    );
    const completedWeekList = trainingWeeks.filter((week) => progress.weeks[week.id].completed);
    const inProgressWeeks = trainingWeeks.filter((week) => statusLabel(progress.weeks[week.id]) === "In Progress");

    return { totalItems, completedItems, completedWeeks, overallPercent, currentWeek, selectedBlockers, completedWeekList, inProgressWeeks };
  }, [progress]);

  useEffect(() => {
    const currentWeekId = totals.currentWeek?.id;
    if (!loaded || !currentWeekId) return;
    setExpandedWeeks((current) => new Set([...current, currentWeekId]));
  }, [loaded, totals.currentWeek?.id]);
  const nextAction = useMemo(() => {
    const week = totals.currentWeek;
    if (!week) return null;
    const itemIndex = progress.weeks[week.id].checked.findIndex((item) => !item);
    if (itemIndex === -1) return { week, itemIndex: null, item: null };
    return { week, itemIndex, item: week.checklist[itemIndex] };
  }, [progress, totals.currentWeek]);

  function showMessage(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3200);
  }

  function saveProfiles(nextProfiles: TraineeProfile[]) {
    setProfiles(nextProfiles);
    window.localStorage.setItem(profilesKey, JSON.stringify(nextProfiles));
  }

  function activateProfile(profileId: string, profileList = profiles) {
    const profile = profileList.find((item) => item.id === profileId);
    if (!profile) return;
    if (activeProfileId) window.localStorage.setItem(progressKey(activeProfileId), JSON.stringify(progress));
    setActiveProfileId(profileId);
    window.localStorage.setItem(activeProfileKey, profileId);
    setProgress(normalizeProgress(readJson(progressKey(profileId), null), profile.name));
  }

  function createProfile(name: string) {
    const cleanName = safeProfileName(name);
    const profile = createProfileRecord(cleanName);
    const oldRaw = window.localStorage.getItem(oldProgressKey);
    let seed = emptyProgress(cleanName);

    if (profiles.length === 0 && oldRaw && !window.localStorage.getItem(migratedKey)) {
      try {
        seed = normalizeProgress(JSON.parse(oldRaw), cleanName);
        seed.recruitName = cleanName;
        window.localStorage.setItem(migratedKey, "true");
      } catch {
        seed = emptyProgress(cleanName);
      }
    }

    window.localStorage.setItem(progressKey(profile.id), JSON.stringify(seed));
    const nextProfiles = [...profiles, profile];
    saveProfiles(nextProfiles);
    setNewProfileName("");
    setProgress(seed);
    setActiveProfileId(profile.id);
    window.localStorage.setItem(activeProfileKey, profile.id);
    setExpandedWeeks(new Set(["week-1"]));
    showMessage(`已创建 trainee profile：${cleanName}`);
  }

  function renameActiveProfile() {
    if (!activeProfile) return;
    const nextName = window.prompt("请输入新的 trainee 名字", activeProfile.name)?.trim();
    if (!nextName) return;
    const now = new Date().toISOString();
    const nextProfiles = profiles.map((profile) =>
      profile.id === activeProfile.id ? { ...profile, name: nextName, updatedAt: now } : profile,
    );
    saveProfiles(nextProfiles);
    setProgress((current) => ({ ...current, recruitName: nextName }));
    showMessage("Trainee 名字已更新。");
  }

  function deleteActiveProfile() {
    if (!activeProfile) return;
    if (!window.confirm(`确定要删除 ${activeProfile.name} 的本机 profile 和进度吗？其他 profile 不会受影响。`)) return;
    window.localStorage.removeItem(progressKey(activeProfile.id));
    const nextProfiles = profiles.filter((profile) => profile.id !== activeProfile.id);
    saveProfiles(nextProfiles);
    const nextActive = nextProfiles[0]?.id ?? "";
    setActiveProfileId(nextActive);
    if (nextActive) {
      window.localStorage.setItem(activeProfileKey, nextActive);
      const nextProfile = nextProfiles[0];
      setProgress(normalizeProgress(readJson(progressKey(nextActive), null), nextProfile.name));
    } else {
      window.localStorage.removeItem(activeProfileKey);
      setProgress(emptyProgress());
    }
    showMessage("已删除当前 profile。");
  }

  function updateWeek(weekId: string, updater: (current: WeekProgress) => WeekProgress) {
    setProgress((current) => ({
      ...current,
      weeks: { ...current.weeks, [weekId]: updater(current.weeks[weekId]) },
    }));
  }

  function toggleChecklist(weekId: string, itemIndex: number) {
    updateWeek(weekId, (current) => {
      const checked = [...current.checked];
      checked[itemIndex] = !checked[itemIndex];
      return { ...current, checked, completed: checked.every(Boolean) };
    });
  }

  function markChecklistItem(weekId: string, itemIndex: number) {
    updateWeek(weekId, (current) => {
      const checked = [...current.checked];
      checked[itemIndex] = true;
      return { ...current, checked, completed: checked.every(Boolean) };
    });
    setExpandedWeeks((current) => new Set([...current, weekId]));
  }

  function toggleBlocker(weekId: string, blockerIndex: number) {
    updateWeek(weekId, (current) => {
      const blockers = [...current.blockers];
      blockers[blockerIndex] = !blockers[blockerIndex];
      return { ...current, blockers };
    });
  }

  function updateNotes(weekId: string, notes: string) {
    updateWeek(weekId, (current) => ({ ...current, notes }));
  }

  function markWeekComplete(weekId: string) {
    updateWeek(weekId, (current) => ({ ...current, checked: current.checked.map(() => true), completed: true }));
  }

  function toggleWeek(weekId: string) {
    setExpandedWeeks((current) => {
      const next = new Set(current);
      if (next.has(weekId)) next.delete(weekId);
      else next.add(weekId);
      return next;
    });
  }

  function jumpToWeek(weekId: string) {
    setExpandedWeeks((current) => new Set([...current, weekId]));
    window.requestAnimationFrame(() => document.getElementById(weekId)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function currentWeekText() {
    if (!totals.currentWeek) return "全部完成";
    return `Week ${totals.currentWeek.weekNumber}`;
  }

  function currentBlockerText() {
    if (totals.selectedBlockers.length === 0) return "暂无卡点";
    const first = totals.selectedBlockers[0];
    const extra = totals.selectedBlockers.length > 1 ? ` +${totals.selectedBlockers.length - 1}` : "";
    return `Week ${first.week.weekNumber}: ${first.blocker.zh}${extra}`;
  }

  function suggestedNextStep() {
    if (!totals.currentWeek) return "和 trainer 复盘下一阶段实战安排。";
    const blockers = selectedTexts(totals.currentWeek.blockers, progress.weeks[totals.currentWeek.id].blockers);
    if (blockers.length > 0) return `先请 trainer 帮你解决：${blockers[0].zh}`;
    if (nextAction?.item) return `完成：${nextAction.item.zh}`;
    return `请和 trainer 复盘 Week ${totals.currentWeek.weekNumber}，然后标记本周完成。`;
  }

  function buildReport() {
    const current = totals.currentWeek;
    const currentProgress = current ? progress.weeks[current.id] : null;
    const currentCompleted = currentProgress?.checked.filter(Boolean).length ?? totals.totalItems;
    const completedWeeks = totals.completedWeekList.map((week) => `- Week ${week.weekNumber} ${week.title.zh}`).join("\n");
    const inProgressWeeks = totals.inProgressWeeks.map((week) => `- Week ${week.weekNumber} ${week.title.zh}`).join("\n");
    const allBlockers = totals.selectedBlockers.map(({ week, blocker }) => `- Week ${week.weekNumber}: ${blocker.zh}`).join("\n");
    const currentNotes = currentProgress?.notes.trim() || "暂无";

    return [
      "新人训练进度汇报",
      "New Recruit Training Progress",
      "",
      `Trainee: ${activeProfile?.name || progress.recruitName || "未填写"}`,
      `Current Week: ${current ? `Week ${current.weekNumber} ${current.title.zh}` : "Completed"}`,
      `Progress: ${totals.completedItems}/${totals.totalItems} tasks completed (${totals.overallPercent}%)`,
      `Completed Weeks: ${totals.completedWeeks}/8`,
      `Current Focus: ${current ? `Week ${current.weekNumber} ${current.title.zh}` : "8 周已全部完成"}`,
      `Next Step: ${suggestedNextStep()}`,
      "",
      "Completed Weeks:",
      completedWeeks || "- 暂无",
      "",
      "In-progress Weeks:",
      inProgressWeeks || "- 暂无",
      "",
      "Current Week Tasks:",
      current ? `- ${currentCompleted}/${current.checklist.length} completed` : "- 全部完成",
      "",
      "Current Blockers:",
      allBlockers || "- 暂无",
      "",
      "Notes:",
      currentNotes,
    ].join("\n");
  }

  async function copyProgressReport() {
    await navigator.clipboard.writeText(buildReport());
    showMessage("已复制给 Trainer 的汇报。");
  }

  async function exportProgress() {
    if (!activeProfile) return;
    const backup = JSON.stringify(
      {
        app: "New Recruit Training Map",
        version: 4,
        exportedAt: new Date().toISOString(),
        profileId: activeProfile.id,
        traineeName: activeProfile.name,
        progress,
      },
      null,
      2,
    );
    await navigator.clipboard.writeText(backup);
    const blob = new Blob([backup], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `new-recruit-training-map-${activeProfile.name.replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage("已导出当前 trainee 的备份，并复制 JSON 到剪贴板。");
  }

  function importProgress() {
    try {
      const parsed = JSON.parse(importText) as { progress?: unknown; traineeName?: string; profileId?: string } | unknown;
      const importedProgress = normalizeProgress((parsed as { progress?: unknown })?.progress ?? parsed, (parsed as { traineeName?: string })?.traineeName ?? activeProfile?.name ?? "");
      const importedName = safeProfileName((parsed as { traineeName?: string })?.traineeName ?? importedProgress.recruitName ?? "Imported Trainee");

      if (importMode === "current") {
        if (!activeProfile) return;
        if (!window.confirm(`确定要用导入备份覆盖 ${activeProfile.name} 当前进度吗？`)) return;
        importedProgress.recruitName = activeProfile.name;
        setProgress(importedProgress);
        window.localStorage.setItem(progressKey(activeProfile.id), JSON.stringify(importedProgress));
      } else {
        const profile = createProfileRecord(importedName);
        importedProgress.recruitName = profile.name;
        window.localStorage.setItem(progressKey(profile.id), JSON.stringify(importedProgress));
        const nextProfiles = [...profiles, profile];
        saveProfiles(nextProfiles);
        setProgress(importedProgress);
        setActiveProfileId(profile.id);
        window.localStorage.setItem(activeProfileKey, profile.id);
      }

      setImportText("");
      showMessage("导入成功。");
    } catch {
      showMessage("导入失败，请粘贴有效的 JSON 备份。");
    }
  }

  function resetProgress() {
    if (!activeProfile) return;
    if (window.confirm(`确定只清空 ${activeProfile.name} 的训练进度吗？其他 trainee profile 不会被重置。`)) {
      const next = emptyProgress(activeProfile.name);
      setProgress(next);
      window.localStorage.setItem(progressKey(activeProfile.id), JSON.stringify(next));
      setExpandedWeeks(new Set(["week-1"]));
      showMessage("当前 trainee 的进度已重置。");
    }
  }

  if (!loaded) {
    return <main className="min-h-screen bg-slate-50 p-6 text-slate-700">Loading...</main>;
  }

  if (!activeProfile) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-blue-700">WFG 新人基础训练</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">新人训练地图</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">New Recruit Training Map</p>
            <p className="mt-4 text-sm leading-6 text-slate-700">第一次使用，请先建立你的 trainee profile。多人共用一台电脑时，每个人都可以切换到自己的本机进度。</p>
            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-xs leading-5 text-blue-900">
              <p>进度仅保存在当前浏览器。不同设备不会自动同步。</p>
              <p className="mt-1">如果多人共用一台电脑，请先切换到自己的 trainee profile。</p>
            </div>
            <label className="mt-5 block text-sm font-bold text-slate-900">
              Your Name / 你的名字
              <input
                className="focus-ring mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-base"
                onChange={(event) => setNewProfileName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") createProfile(newProfileName);
                }}
                placeholder="请输入你的名字"
                value={newProfileName}
              />
            </label>
            <button className="focus-ring mt-4 min-h-12 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800" onClick={() => createProfile(newProfileName)} type="button">
              开始训练 / Start Training
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1100px] px-4 py-5 sm:px-6 sm:py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">WFG 新人基础训练</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">新人训练地图</h1>
              <p className="mt-1 text-base font-medium text-slate-500">New Recruit Training Map</p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">8 周完成从了解业务、考证准备、邀约练习，到跟随 trainer 实战的基础训练。</p>
              <div className="mt-3 max-w-2xl rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <p>进度仅保存在当前浏览器。本工具不保存客户名单、联系方式或敏感资料。</p>
                <p className="mt-1">进度仅保存在当前浏览器。不同设备不会自动同步。</p>
                <p className="mt-1">如果多人共用一台电脑，请先切换到自己的 trainee profile。</p>
              </div>
            </div>
            <ProfileSwitcher
              activeProfileId={activeProfileId}
              newProfileName={newProfileName}
              onCreate={() => createProfile(newProfileName)}
              onDelete={deleteActiveProfile}
              onNameChange={setNewProfileName}
              onRename={renameActiveProfile}
              onSwitch={activateProfile}
              profiles={profiles}
            />
          </div>
          {message ? <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">{message}</p> : null}
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="总进度" sublabel="Overall Progress" value={`${totals.overallPercent}%`} />
          <SummaryCard label="当前周" sublabel="Current Week" value={currentWeekText()} />
          <SummaryCard label="已完成任务" sublabel="Completed Tasks" value={`${totals.completedItems}/${totals.totalItems}`} />
          <SummaryCard label="当前卡点" sublabel="Current Blocker" value={currentBlockerText()} compact />
        </section>

        <section className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">下一步</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Next Step</h2>
              <p className="mt-3 text-base font-semibold text-slate-900">{suggestedNextStep()}</p>
              <p className="mt-1 text-sm text-slate-600">{totals.currentWeek ? `${totals.currentWeek.title.zh} · ${totals.currentWeek.title.en}` : "你已经完成全部 8 周训练。"}</p>
            </div>
            <button
              className="focus-ring min-h-12 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!nextAction?.item || nextAction.itemIndex === null}
              onClick={() => {
                if (nextAction?.itemIndex !== null && nextAction?.itemIndex !== undefined) markChecklistItem(nextAction.week.id, nextAction.itemIndex);
              }}
              type="button"
            >
              标记完成 / Mark Complete
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {trainingWeeks.map((week) => {
              const status = statusLabel(progress.weeks[week.id]);
              const active = totals.currentWeek?.id === week.id;
              return (
                <button
                  className={`min-w-fit rounded-full border px-4 py-2 text-left text-sm font-semibold transition ${
                    active
                      ? "border-blue-700 bg-blue-700 text-white"
                      : status === "Completed"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
                  }`}
                  key={week.id}
                  onClick={() => jumpToWeek(week.id)}
                  type="button"
                >
                  Week {week.weekNumber}
                  <span className="ml-2 text-xs opacity-80">{statusZh(status)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">给 Trainer 的汇报</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">Trainer Report</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">自动整理当前 trainee 的当前周进度、卡点、笔记和建议下一步，方便复制到 WeChat 发给 trainer。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ActionButton icon={<ClipboardCopy size={16} />} label="Copy Report" onClick={copyProgressReport} primary />
              <ActionButton icon={<Download size={16} />} label="Export Backup" onClick={exportProgress} />
              <ActionButton icon={<RotateCcw size={16} />} label="Reset Current" onClick={resetProgress} danger />
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <p>Trainee：{activeProfile.name}</p>
            <p>当前重点：{totals.currentWeek ? `Week ${totals.currentWeek.weekNumber} ${totals.currentWeek.title.zh}` : "全部完成"}</p>
            <p>当前卡点：{currentBlockerText()}</p>
            <p>建议下一步：{suggestedNextStep()}</p>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Upload size={16} className="text-blue-700" />
              导入备份 / Import Backup
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-700">
              <label className="inline-flex items-center gap-2">
                <input checked={importMode === "current"} onChange={() => setImportMode("current")} type="radio" />
                导入到当前 profile
              </label>
              <label className="inline-flex items-center gap-2">
                <input checked={importMode === "new"} onChange={() => setImportMode("new")} type="radio" />
                导入为新的 profile
              </label>
            </div>
            <textarea
              className="focus-ring mt-3 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
              onChange={(event) => setImportText(event.target.value)}
              placeholder="粘贴 Export Backup 生成的 JSON"
              value={importText}
            />
            <button className="focus-ring mt-3 min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50" onClick={importProgress} type="button">
              导入进度 / Import Progress
            </button>
          </div>
        </section>

        <section className="mt-5 space-y-3">
          {trainingWeeks.map((week) => {
            const weekProgress = progress.weeks[week.id];
            const completedCount = weekProgress.checked.filter(Boolean).length;
            const status = statusLabel(weekProgress);
            const weekPercent = percent(completedCount, week.checklist.length);
            const expanded = expandedWeeks.has(week.id);
            const selectedBlockers = selectedTexts(week.blockers, weekProgress.blockers);

            return (
              <article className="scroll-mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm" id={week.id} key={week.id}>
                <button className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6" onClick={() => toggleWeek(week.id)} type="button">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Week {week.weekNumber}</span>
                      <StatusBadge status={status} />
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-slate-950">{week.title.zh}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{week.title.en}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{week.goal.zh}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1"><ProgressBar value={weekPercent} /></div>
                      <span className="text-sm font-semibold text-slate-600">{completedCount}/{week.checklist.length}</span>
                    </div>
                  </div>
                  <ChevronDown className={`mt-2 shrink-0 text-slate-500 transition ${expanded ? "rotate-180" : ""}`} size={20} />
                </button>

                {expanded ? (
                  <div className="border-t border-slate-200 px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                      <p className="font-bold text-slate-950">本周提示</p>
                      <p className="mt-1">{week.guidance.zh}</p>
                      <p className="mt-1 text-xs text-slate-500">{week.guidance.en}</p>
                    </div>

                    <div className="mt-5 space-y-2">
                      {week.checklist.map((item, index) => (
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50" key={item.zh}>
                          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${weekProgress.checked[index] ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 bg-white"}`}>
                            {weekProgress.checked[index] ? <Check size={15} aria-hidden="true" /> : null}
                          </span>
                          <input checked={weekProgress.checked[index]} className="sr-only" onChange={() => toggleChecklist(week.id, index)} type="checkbox" />
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">{item.zh}</span>
                            <span className="mt-0.5 block text-xs leading-5 text-slate-500">{item.en}</span>
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-bold text-slate-950">你现在卡在哪里？</p>
                      <p className="text-xs text-slate-500">What is blocking you?</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {week.blockers.map((blocker, index) => {
                          const selected = weekProgress.blockers[index];
                          return (
                            <button
                              className={`rounded-full border px-3 py-2 text-left text-sm font-semibold transition ${selected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"}`}
                              key={blocker.zh}
                              onClick={() => toggleBlocker(week.id, index)}
                              type="button"
                            >
                              {blocker.zh}
                            </button>
                          );
                        })}
                      </div>
                      {selectedBlockers.length > 0 ? <p className="mt-2 text-xs text-blue-700">已选择：{cnList(selectedBlockers)}</p> : null}
                    </div>

                    <label className="mt-5 block text-sm font-bold text-slate-950">
                      训练笔记
                      <span className="mt-0.5 block text-xs font-medium text-slate-500">Notes for questions, trainer feedback, and next steps.</span>
                      <textarea
                        className="focus-ring mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal text-slate-950"
                        onChange={(event) => updateNotes(week.id, event.target.value)}
                        placeholder="写下问题、trainer 反馈或下一步。不要输入客户名单、电话或微信。"
                        value={weekProgress.notes}
                      />
                    </label>

                    <button className="focus-ring mt-4 min-h-12 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800" onClick={() => markWeekComplete(week.id)} type="button">
                      标记整周完成 / Mark Whole Week Complete
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          你的进度只保存在当前设备和浏览器。如果更换设备或清除浏览器资料，进度可能会丢失。请定期使用 Copy Report 或 Export Backup。
          <span className="mt-1 block text-xs text-amber-800">Your progress is saved only on this device and browser. Please copy or export regularly.</span>
        </section>
      </div>
    </main>
  );
}

function ProfileSwitcher({
  activeProfileId,
  newProfileName,
  onCreate,
  onDelete,
  onNameChange,
  onRename,
  onSwitch,
  profiles,
}: {
  activeProfileId: string;
  newProfileName: string;
  onCreate: () => void;
  onDelete: () => void;
  onNameChange: (name: string) => void;
  onRename: () => void;
  onSwitch: (profileId: string) => void;
  profiles: TraineeProfile[];
}) {
  const activeProfile = profiles.find((profile) => profile.id === activeProfileId);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trainee Profile</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{activeProfile?.name ?? "未选择"}</p>
      <label className="mt-3 block text-xs font-bold text-slate-700">
        切换 profile
        <select className="focus-ring mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" onChange={(event) => onSwitch(event.target.value)} value={activeProfileId}>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>{profile.name}</option>
          ))}
        </select>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="focus-ring rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100" onClick={onRename} type="button">Rename</button>
        <button className="focus-ring rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50" onClick={onDelete} type="button">Delete</button>
      </div>
      <div className="mt-4 border-t border-slate-200 pt-4">
        <label className="block text-xs font-bold text-slate-700">
          新建 trainee profile
          <input
            className="focus-ring mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            onChange={(event) => onNameChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onCreate();
            }}
            placeholder="名字"
            value={newProfileName}
          />
        </label>
        <button className="focus-ring mt-2 inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800" onClick={onCreate} type="button">
          <UserPlus size={14} />
          Create Profile
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, sublabel, value, compact = false }: { label: string; sublabel: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-xs font-medium text-slate-500">{sublabel}</p>
      <p className={`mt-3 font-bold text-slate-950 ${compact ? "text-base leading-6" : "text-3xl"}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const style =
    status === "Completed"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "In Progress"
        ? "bg-blue-50 text-blue-800 border-blue-200"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${style}`}>{statusZh(status)}</span>;
}

function ActionButton({ icon, label, onClick, primary = false, danger = false }: { icon: ReactNode; label: string; onClick: () => void; primary?: boolean; danger?: boolean }) {
  const style = primary
    ? "bg-blue-700 text-white hover:bg-blue-800 border-blue-700"
    : danger
      ? "bg-white text-red-700 hover:bg-red-50 border-red-200"
      : "bg-white text-slate-800 hover:bg-slate-50 border-slate-300";

  return (
    <button className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${style}`} onClick={onClick} type="button">
      {icon}
      {label}
    </button>
  );
}

