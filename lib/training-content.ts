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
    title: { zh: "理解事业模式与专业边界", en: "Understand the Business Model and Professional Boundaries" },
    goal: {
      zh: "先建立整体理解，明确 trainer 支持体系，以及新人前期应该做什么、不能做什么。",
      en: "Build a clear foundation first. Understand the support system and professional boundaries.",
    },
    guidance: {
      zh: "先建立整体理解，不急着对外表达。把不清楚的地方记录下来，和 trainer 一起澄清。",
      en: "Focus on the big picture first. Write down unclear points and review them with your trainer.",
    },
    checklist: [
      { zh: "看完团队基础介绍", en: "Review the team overview" },
      { zh: "理解 WFG 的 broker model", en: "Understand the broker model" },
      { zh: "理解 trainer 支持体系", en: "Understand how trainer support works" },
      { zh: "写下 3 个自己还不清楚的问题，带给 trainer", en: "Write down 3 questions for your trainer" },
    ],
    blockers: [
      { zh: "我还不太理解 WFG 的业务模式", en: "I am still learning how the WFG business model works" },
      { zh: "我不确定新人前期应该做什么", en: "I am not sure what to focus on in the early stage" },
      { zh: "我不清楚哪些事情需要 trainer 陪同", en: "I am not sure which steps need trainer support" },
      { zh: "我想先了解团队文化和长期发展路径", en: "I would like to understand the team culture and long-term path first" },
    ],
  },
  {
    id: "week-2",
    weekNumber: 2,
    title: { zh: "整理个人关系与服务对象方向", en: "Map Personal Network and Service Opportunities" },
    goal: {
      zh: "私下梳理身边哪些人群可能需要财务教育、风险保护、退休规划或家庭保障方面的信息。这个阶段不需要输入具体姓名、电话、微信，也不需要马上联系对方。",
      en: "Privately think through who may benefit from financial education. Do not store private contact details in this tool.",
    },
    guidance: {
      zh: "这一步不是让你马上联系别人，而是帮助你建立服务意识：谁可能需要财务教育？谁可能有家庭保障、退休规划、风险管理方面的问题？实际沟通前，请先和 trainer 确认方式与边界。",
      en: "This step is for service awareness and preparation. Review the communication approach and boundaries with your trainer before reaching out.",
    },
    checklist: [
      { zh: "私下梳理自己熟悉的关系圈类型", en: "Privately map your relationship circles" },
      { zh: "思考哪些人群可能需要财务教育或保障规划", en: "Identify groups who may benefit from financial education" },
      { zh: "不在本工具中输入姓名、电话、微信或联系方式", en: "Do not enter names, phone numbers, WeChat IDs, or contact details here" },
      { zh: "和 trainer 讨论哪些方向适合先从教育型沟通开始", en: "Review appropriate starting points with your trainer" },
    ],
    blockers: [
      { zh: "我不确定哪些人适合先沟通", en: "I am not sure who to start with" },
      { zh: "我担心打扰别人", en: "I am worried about bothering people" },
      { zh: "我不知道如何自然地开始", en: "I am not sure how to start naturally" },
      { zh: "我希望 trainer 帮我判断优先级", en: "I would like my trainer to help me set priorities" },
    ],
  },
  {
    id: "week-3",
    weekNumber: 3,
    title: { zh: "确认执照路径与学习计划", en: "Confirm Licensing Path and Learning Plan" },
    goal: {
      zh: "确认所在州的执照要求，了解学习和考试安排，建立现实可执行的节奏。",
      en: "Confirm licensing requirements and build a realistic study plan.",
    },
    guidance: {
      zh: "目标不是马上考试，而是先把路径搞清楚。不同州要求可能不同，请以 trainer 和官方要求为准。",
      en: "The goal is to clarify the path first. Requirements may vary by state.",
    },
    checklist: [
      { zh: "确认所在州的 license 要求", en: "Confirm state licensing requirements" },
      { zh: "确认是否需要报名 pre-licensing course", en: "Confirm pre-licensing course requirements" },
      { zh: "和 trainer 约定学习节奏", en: "Set a realistic study timeline with your trainer" },
      { zh: "明确考试前后自己能做和不能做的事情", en: "Understand what you can and cannot do before licensing" },
    ],
    blockers: [
      { zh: "我不清楚执照报名流程", en: "I am not sure how the licensing registration works" },
      { zh: "我担心学习时间不够", en: "I am worried about not having enough study time" },
      { zh: "我不知道考试前可以参与哪些活动", en: "I am not sure what I can take part in before licensing" },
      { zh: "我需要 trainer 帮我规划时间线", en: "I would like my trainer to help me plan the timeline" },
    ],
  },
  {
    id: "week-4",
    weekNumber: 4,
    title: { zh: "理解客户服务流程", en: "Understand the Client Service Process" },
    goal: {
      zh: "理解一次专业 appointment 的基本流程，以及客户教育、需求了解和方案讨论之间的区别。",
      en: "Understand the basic client service flow and the role of needs discovery.",
    },
    guidance: {
      zh: "专业服务的核心不是急着介绍方案，而是先理解客户情况、发现问题、提供清晰解释。",
      en: "Professional service starts with understanding the client, not pushing a solution.",
    },
    checklist: [
      { zh: "了解一次完整 appointment 的基本流程", en: "Understand the basic appointment flow" },
      { zh: "理解 FNA / needs analysis 的作用", en: "Understand the purpose of needs analysis" },
      { zh: "理解客户教育、需求了解、方案讨论的区别", en: "Understand education, discovery, and solution discussion" },
      { zh: "记录自己认为客户最常见的 3 类问题", en: "Write down 3 common client questions you expect" },
    ],
    blockers: [
      { zh: "我不理解 FNA 是什么", en: "I do not understand what an FNA is" },
      { zh: "我不知道 appointment 里具体发生什么", en: "I am not sure what happens during an appointment" },
      { zh: "我担心自己解释不清楚", en: "I am worried I cannot explain things clearly" },
      { zh: "我想先看 trainer 怎么做", en: "I would like to watch my trainer first" },
    ],
  },
  {
    id: "week-5",
    weekNumber: 5,
    title: { zh: "观察 Trainer 的客户沟通", en: "Observe Trainer-Led Communication" },
    goal: {
      zh: "通过 BPM、field training 或 trainer-led appointment，观察专业沟通方式。",
      en: "Observe how an experienced trainer communicates with clients.",
    },
    guidance: {
      zh: "观察重点不是背内容，而是学习 trainer 如何建立信任、倾听需求、解释概念。",
      en: "Observe how the trainer builds trust, listens, and explains clearly.",
    },
    checklist: [
      { zh: "参加一次 BPM 或团队训练会议", en: "Attend one BPM or team training session" },
      { zh: "观察 trainer 如何开场和提问", en: "Observe how your trainer opens and asks questions" },
      { zh: "记录 3 个你觉得专业、自然的表达方式", en: "Write down 3 professional expressions you observed" },
      { zh: "和 trainer 做一次简短复盘", en: "Debrief with your trainer" },
    ],
    blockers: [
      { zh: "我还没有参加过 BPM", en: "I have not attended a BPM yet" },
      { zh: "我不知道观察时该重点看什么", en: "I am not sure what to focus on when observing" },
      { zh: "我不确定哪些表达比较专业", en: "I am not sure which expressions are professional" },
      { zh: "我需要 trainer 帮我复盘", en: "I would like my trainer to help me debrief" },
    ],
  },
  {
    id: "week-6",
    weekNumber: 6,
    title: { zh: "练习自然、专业的邀请表达", en: "Practice Natural and Professional Invitation" },
    goal: {
      zh: "学习如何用自然、尊重、不施压的方式介绍一次财务教育或需求了解的机会。",
      en: "Practice a respectful and natural way to invite someone to learn.",
    },
    guidance: {
      zh: "邀请不应该让对方有压力。重点是自然、尊重、清楚地说明你希望分享一个有价值的教育资源。",
      en: "Keep the invitation respectful, clear, and low-pressure.",
    },
    checklist: [
      { zh: "理解教育型邀请的基本结构", en: "Understand the structure of an educational invitation" },
      { zh: "用自己的语言写一版 2–3 句话的邀请表达", en: "Write a short invitation in your own words" },
      { zh: "和 trainer 演练一次，并根据反馈修改", en: "Practice once with your trainer and refine it" },
      { zh: "准备一个自然的后续跟进方式", en: "Prepare a respectful follow-up approach" },
    ],
    blockers: [
      { zh: "我担心表达得太有压力", en: "I am worried it sounds too pushy" },
      { zh: "我不知道怎么开口比较自然", en: "I am not sure how to start naturally" },
      { zh: "我不知道对方拒绝后怎么回应", en: "I am not sure how to respond if someone declines" },
      { zh: "我需要 trainer 帮我改表达", en: "I would like my trainer to help me refine my wording" },
    ],
  },
  {
    id: "week-7",
    weekNumber: 7,
    title: { zh: "参与一次 Trainer-Led Appointment", en: "Join a Trainer-Led Appointment" },
    goal: {
      zh: "在 trainer 主导下参与一次 appointment，重点学习客户需求、沟通节奏和会后复盘。",
      en: "Join a trainer-led appointment and learn through observation.",
    },
    guidance: {
      zh: "你不需要主导整场 appointment。重点是观察客户需求、学习提问方式、理解 trainer 如何建立信任。",
      en: "You do not need to lead the appointment. Focus on observing and learning.",
    },
    checklist: [
      { zh: "和 trainer 确认本次 appointment 的目标", en: "Confirm the goal of the appointment with your trainer" },
      { zh: "参与一次 trainer-led appointment", en: "Join one trainer-led appointment" },
      { zh: "观察客户最关心的问题", en: "Observe what the client cares about most" },
      { zh: "会后和 trainer 复盘", en: "Debrief with your trainer afterward" },
    ],
    blockers: [
      { zh: "我还没有合适的 appointment", en: "I do not have a suitable appointment yet" },
      { zh: "我不知道自己在 meeting 中应该做什么", en: "I am not sure what to do during the meeting" },
      { zh: "我担心自己说错话", en: "I am worried about saying the wrong thing" },
      { zh: "我需要 trainer 陪同和复盘", en: "I would like trainer support and a debrief" },
    ],
  },
  {
    id: "week-8",
    weekNumber: 8,
    title: { zh: "准备一次有支持的独立沟通", en: "Prepare for a Supported Independent Conversation" },
    goal: {
      zh: "在 trainer 支持下，准备并完成一次更主动的沟通练习，建立下一阶段成长计划。",
      en: "Prepare for a supported conversation and build the next growth plan.",
    },
    guidance: {
      zh: "这一步不是要求你完全独立完成所有事情，而是在 trainer 支持下，开始建立自己的专业沟通能力。",
      en: "This is not about doing everything alone. It is about growing with trainer support.",
    },
    checklist: [
      { zh: "和 trainer 选择一个合适的沟通对象或场景", en: "Select an appropriate conversation or scenario with your trainer" },
      { zh: "准备开场问题和沟通目标", en: "Prepare opening questions and conversation goals" },
      { zh: "完成一次有 trainer 支持的独立沟通", en: "Complete one supported independent conversation" },
      { zh: "复盘下一步成长计划", en: "Review your next growth steps" },
    ],
    blockers: [
      { zh: "我还没有准备好独立沟通", en: "I do not feel ready for an independent conversation yet" },
      { zh: "我不知道如何设定沟通目标", en: "I am not sure how to set conversation goals" },
      { zh: "我希望 trainer 帮我一起准备", en: "I would like my trainer to help me prepare" },
      { zh: "我想先再观察一次", en: "I would like to observe once more first" },
    ],
  },
];
