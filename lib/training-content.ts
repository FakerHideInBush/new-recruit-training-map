export type TrainingText = {
  zh: string;
  en: string;
};

export type TrainingWeek = {
  id: string;
  weekNumber: number;
  title: TrainingText;
  goal: TrainingText;
  guidance: TrainingText;
  checklist: TrainingText[];
  blockers: TrainingText[];
};

export const storageKey = "new-recruit-training-map-progress";

export const trainingWeeks: TrainingWeek[] = [
  {
    id: "week-1",
    weekNumber: 1,
    title: { zh: "理解 WFG 商业模式", en: "Understand WFG Business Model" },
    goal: { zh: "了解 broker 模式、trainer 支持系统，以及新人前期应该掌握的基本框架。", en: "Learn the broker model, trainer support system, and the basic onboarding structure." },
    guidance: { zh: "先把大方向弄清楚，不需要一次理解所有细节。把不清楚的地方写下来，带去问 leader。", en: "Focus on the big picture first. Write down unclear points and ask your leader." },
    checklist: [
      { zh: "看完业务概览视频", en: "Watched business overview video" },
      { zh: "理解 broker 模式", en: "Understood broker model" },
      { zh: "理解 trainer 支持系统", en: "Understood trainer support system" },
      { zh: "写下 3 个要问 leader 的问题", en: "Wrote down 3 questions for leader" },
    ],
    blockers: [
      { zh: "我还没有完全理解 WFG 商业模式", en: "I do not fully understand the WFG business model" },
      { zh: "我不确定 WFG 和普通工作有什么不同", en: "I am not sure how WFG is different from a regular job" },
      { zh: "我不知道该问 leader 什么问题", en: "I do not know what questions to ask my leader" },
    ],
  },
  {
    id: "week-2",
    weekNumber: 2,
    title: { zh: "完成执照报名准备", en: "Complete License Registration" },
    goal: { zh: "确认所在州的考试要求，开始课程注册，并安排合理的考试时间线。", en: "Confirm state requirements, start course registration, and plan your exam timeline." },
    guidance: { zh: "先问 trainer 你所在州的第一步是什么。目标不是马上考完，而是把路径和时间表定下来。", en: "Ask your trainer for the first required step in your state and set a clear timeline." },
    checklist: [
      { zh: "确认本州执照要求", en: "Confirmed state license requirement" },
      { zh: "创建考试或课程账号", en: "Created exam provider account" },
      { zh: "开始 pre-licensing 课程", en: "Started pre-licensing course" },
      { zh: "安排或规划考试时间线", en: "Scheduled or planned exam timeline" },
    ],
    blockers: [
      { zh: "我不知道如何报名执照课程", en: "I do not know how to register for the license course" },
      { zh: "我对考试要求有点混乱", en: "I am confused about exam requirements" },
      { zh: "我担心时间投入不够", en: "I am worried about time commitment" },
    ],
  },
  {
    id: "week-3",
    weekNumber: 3,
    title: { zh: "练习邀约话术", en: "Learn Invite Script" },
    goal: { zh: "把基础邀约说顺，完成 role play，并开始小范围 warm market 练习。", en: "Practice the basic invite, role-play it, and start a small warm-market outreach batch." },
    guidance: { zh: "话术越短越自然越好。重点是邀请对方了解，不是在信息里解释完整业务。", en: "Keep the invite short and natural. Invite interest instead of explaining everything." },
    checklist: [
      { zh: "读完基础邀约话术", en: "Read the basic invite script" },
      { zh: "大声练习 5 次", en: "Practiced script out loud 5 times" },
      { zh: "和 trainer 做 role play", en: "Role-played with trainer" },
      { zh: "发出前 5 条 warm-market 信息", en: "Sent first 5 warm-market messages" },
    ],
    blockers: [
      { zh: "我觉得邀约别人很尴尬", en: "I feel awkward inviting people" },
      { zh: "我怕朋友觉得我在推销", en: "I am afraid friends will think I am selling something" },
      { zh: "对方回复后我不知道怎么接", en: "I do not know what to say after they reply" },
      { zh: "我发了信息但没有人回复", en: "I sent messages but people did not respond" },
    ],
  },
  {
    id: "week-4",
    weekNumber: 4,
    title: { zh: "参加 BPM / Field Training", en: "Attend BPM / Field Training" },
    goal: { zh: "参加团队训练或会议，观察 trainer 如何讲解、互动和处理问题。", en: "Attend team training and observe how trainers explain, interact, and handle questions." },
    guidance: { zh: "观察 trainer 的开场、提问、讲解和收尾。记下 3 个你可以模仿的动作。", en: "Watch the trainer's opening, questions, explanation, and close. Capture 3 actions to copy." },
    checklist: [
      { zh: "参加 BPM 或同等训练会议", en: "Attended BPM or equivalent meeting" },
      { zh: "观察 trainer presentation", en: "Observed trainer presentation" },
      { zh: "写下 3 个关键收获", en: "Wrote down 3 key takeaways" },
      { zh: "问 trainer 一个跟进问题", en: "Asked trainer one follow-up question" },
    ],
    blockers: [
      { zh: "我还没有参加 BPM", en: "I have not attended BPM yet" },
      { zh: "我不知道 field training 要观察什么", en: "I do not understand what to observe during field training" },
      { zh: "我不知道怎样做有用的笔记", en: "I do not know how to take useful notes" },
    ],
  },
  {
    id: "week-5",
    weekNumber: 5,
    title: { zh: "完成前 20 人名单", en: "Complete First 20 Name List" },
    goal: { zh: "私下完成初步名单练习，并和 trainer 复盘名单策略。本工具不收集姓名或联系方式。", en: "Privately complete the first list exercise and review strategy with your trainer." },
    guidance: { zh: "名单只在你自己手上完成。这里不要输入姓名、电话、微信或任何私人联系方式。", en: "Keep the actual list private. Do not enter names, phone numbers, WeChat IDs, or contacts here." },
    checklist: [
      { zh: "私下完成至少 20 个名字", en: "Completed at least 20 names privately" },
      { zh: "和 trainer 复盘名单策略", en: "Reviewed name list strategy with trainer" },
      { zh: "私下排出前 5 个 warm contacts", en: "Prioritized top 5 warm contacts privately" },
      { zh: "没有把私人联系方式上传到本工具", en: "Did not upload private contact details into this tool" },
    ],
    blockers: [
      { zh: "我写名单时感觉不舒服", en: "I feel uncomfortable writing a name list" },
      { zh: "我不知道应该把谁放进名单", en: "I do not know who to put on the list" },
      { zh: "我担心打扰别人", en: "I am worried about bothering people" },
      { zh: "我需要 trainer 帮我排序联系人", en: "I need trainer help to prioritize contacts" },
    ],
  },
  {
    id: "week-6",
    weekNumber: 6,
    title: { zh: "练习 Mock FNA", en: "Practice Mock FNA" },
    goal: { zh: "熟悉基础 FNA 流程，练习开场问题，并从 trainer 那里获得反馈。", en: "Learn the basic FNA flow, practice opening questions, and get trainer feedback." },
    guidance: { zh: "先练流程，不追求完美。重点是学会问清楚问题，并听懂对方的需求。", en: "Practice the flow first. Focus on clear questions and listening for needs." },
    checklist: [
      { zh: "了解基础 FNA 流程", en: "Learned basic FNA flow" },
      { zh: "练习 opening questions", en: "Practiced opening questions" },
      { zh: "和 trainer 完成一次 mock FNA", en: "Completed one mock FNA with trainer" },
      { zh: "收到并记录 trainer 反馈", en: "Received feedback" },
    ],
    blockers: [
      { zh: "我还不理解 FNA 流程", en: "I do not understand the FNA flow" },
      { zh: "我不知道该问什么问题", en: "I do not know what questions to ask" },
      { zh: "我需要更多 role play 练习", en: "I need more role play practice" },
    ],
  },
  {
    id: "week-7",
    weekNumber: 7,
    title: { zh: "跟随 Trainer 做 Appointment", en: "Do Appointment with Trainer" },
    goal: { zh: "参加一次 trainer appointment，观察沟通方式、异议处理和会后复盘。", en: "Join a trainer appointment and observe communication, objections, and debriefing." },
    guidance: { zh: "去之前先决定你要观察什么。结束后马上复盘：哪里清楚，哪里还不懂。", en: "Decide what to observe before the meeting. Debrief what was clear and unclear afterward." },
    checklist: [
      { zh: "参加 trainer appointment", en: "Joined trainer appointment" },
      { zh: "观察客户沟通方式", en: "Observed client communication" },
      { zh: "写下听到的 objections", en: "Wrote down objections heard" },
      { zh: "和 trainer 完成 debrief", en: "Debriefed with trainer" },
    ],
    blockers: [
      { zh: "我还没有参加 trainer appointment", en: "I have not joined a trainer appointment yet" },
      { zh: "我不知道该观察什么", en: "I do not know what to observe" },
      { zh: "我不确定会后怎么 debrief", en: "I am unsure how to debrief after the appointment" },
    ],
  },
  {
    id: "week-8",
    weekNumber: 8,
    title: { zh: "预约自己的 Independent Appointment", en: "Book Independent Appointment" },
    goal: { zh: "选择一个合适对象，准备开场问题，并预约第一次独立 appointment。", en: "Choose a target contact, prepare opening questions, and book an independent appointment." },
    guidance: { zh: "先选一个最自然的人。邀约前把开场问题给 trainer 看一遍，降低紧张感。", en: "Choose the most natural first contact and review your opening questions with your trainer." },
    checklist: [
      { zh: "选定一个目标联系人", en: "Selected target contact" },
      { zh: "发出邀约信息", en: "Sent invite message" },
      { zh: "预约 appointment 时间", en: "Scheduled appointment" },
      { zh: "准备 opening questions", en: "Prepared opening questions" },
    ],
    blockers: [
      { zh: "我对自己预约 appointment 感到紧张", en: "I am nervous about booking my own appointment" },
      { zh: "我不知道先邀约谁", en: "I do not know who to invite first" },
      { zh: "我需要帮助准备 opening questions", en: "I need help preparing opening questions" },
    ],
  },
];
