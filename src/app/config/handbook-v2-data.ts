/**
 * 人类手册馆 v2 - 数据配置
 *
 * 设计依据：version-2.2-260601/design/human-manual-module.md
 *
 * 说明：
 *   - 数据以现有五卷静态数据为准（参考图里的十卷命名只是参考，不采用）。
 *   - 本期先做五卷，把架子搭好供老师审查；另五卷与完整正文后续填充。
 *   - 读后练习按"当前章节内容"针对性设计，每章不同。
 *   - 阅读入口推荐为静态模拟（后台推荐系统为后续工作）。
 */

// 占位封面（先用现有首页背景图占位，待交互定稿后替换）
import coverPlaceholder from "@/assets/images/home/1-menqian.webp";

// ─── 类型定义 ──────────────────────────────────────────

/** 章节读后练习（针对该章节核心内容） */
export interface ChapterPractice {
  /** 引导句 */
  intro: string;
  /** 思考一问 */
  question: string;
  /** 1 分钟自照练习步骤 */
  steps: string[];
}

/** 卷内章节 */
export interface V2Chapter {
  id: string;
  /** 章节序号（显示用） */
  index: number;
  /** 章节标题 */
  title: string;
  /** 章节副标题 */
  subtitle: string;
  /** 导读条（每章前的一句方向引导） */
  guide: string;
  /** 正文段落 */
  paragraphs: string[];
  /** 读后练习（按本章内容针对性设计） */
  practice: ChapterPractice;
}

/** 卷 */
export interface V2Volume {
  id: string;
  /** 卷序号 */
  volumeNumber: number;
  /** 卷名 */
  title: string;
  /** 副标题 */
  subtitle: string;
  /** 核心主题 */
  coreTheme: string;
  /** 一句话简介（书架/横滑用） */
  oneLine: string;
  /** 本卷导言 */
  intro: string;
  /** 关键词 */
  keywords: string[];
  /** 占位封面背景图（后续替换为新图） */
  cover: string;
  /** 章节 */
  chapters: V2Chapter[];
}

// ─── 占位封面（先用现有首页背景图占位，待交互定稿后替换） ──
export const VOLUME_COVER_PLACEHOLDER = coverPlaceholder;

// ─── 五卷数据 ──────────────────────────────────────────

export const V2_VOLUMES: V2Volume[] = [
  {
    id: "vol-1",
    volumeNumber: 1,
    title: "真相启示录",
    subtitle: "感知本源 · 宇宙真相",
    coreTheme: "启蒙性",
    oneLine: "看见真相，回到生命本身",
    intro:
      "本卷引导你穿越层层幻象，回到真相的源头。感知是宇宙诞生的源头，维度不是地方而是频率。通过观察、辨识与内观，建立看见真相的能力，从而选择真实的生活。",
    keywords: ["感知本源", "维度真相", "幻象系统", "五大剧场"],
    cover: coverPlaceholder,
    chapters: [
      {
        id: "v1-c1",
        index: 1,
        title: "感知即存在",
        subtitle: "宇宙诞生的源头",
        guide: "本节带你回到思维之前的那个『在』，理解感知为何是一切的起点。",
        paragraphs: [
          "感知是宇宙诞生的源头。这不是一个哲学假说，而是一个可以被直接体验的事实。",
          "当你真正安静下来，放下所有的思维活动，你会发现：在思维之前，已经有一个『在』。这个『在』不是任何东西，但它是所有东西得以存在的基础。",
          "没有感知，你怎么知道有物质？没有感知，你怎么知道有世界？感知不是世界的产物，感知是世界得以呈现的前提。",
          "这就是为什么我们说：感知即存在。不是『我思故我在』，而是『我在故我思』。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "此刻，在你的念头之间，是否能觉察到那个一直『在』的自己？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "把注意力从念头移开，只是『在』。",
            "觉察：思维停止的瞬间，是否还有一个『在』？",
            "睁开眼，带着这份『在』继续此刻。",
          ],
        },
      },
      {
        id: "v1-c2",
        index: 2,
        title: "维度的真相",
        subtitle: "频率而非地方",
        guide: "本节带你重新理解『维度』：它不是要去的地方，而是你此刻的频率。",
        paragraphs: [
          "我们通常把维度理解为空间的层次——三维、四维。但这种理解是有局限的。",
          "维度不是地方，维度是频率。你不需要去哪里才能进入更高维度，你只需要改变你的频率。",
          "当你处于恐惧、愤怒的状态时，你在一个频率；当你处于平静、喜悦、爱的状态时，你在另一个频率。",
          "所谓『升维』，不是去到更高级的地方，而是让自己的存在状态变得更清澈、更通透、更接近本源。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "此刻你的存在状态是什么频率？是紧缩，还是开放？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "感受身体此刻是收紧的还是松开的。",
            "觉察：是什么让我的频率变浑浊了？",
            "选择让自己松开一点点，回到清澈。",
          ],
        },
      },
      {
        id: "v1-c3",
        index: 3,
        title: "幻象控制系统",
        subtitle: "恐惧与匮乏的牢笼",
        guide: "本节带你看清恐惧与匮乏如何运作，以及如何从中醒来。",
        paragraphs: [
          "人类社会运行在一个精密的幻象控制系统中。这个系统的核心是两个东西：恐惧和匮乏。",
          "恐惧让你不敢做真实的自己；匮乏让你不断追逐，相信自己永远不够。",
          "这个系统不是某个人设计的，它是集体无意识的产物。每一个处于恐惧中的人，都在无意识地强化它。",
          "看清它，不是为了对抗，而是为了醒来。觉醒不是打败什么，觉醒是看清什么。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "今天你哪一个行为，其实是被恐惧或匮乏推动的？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "回想今天一件让你焦虑的小事。",
            "觉察：这背后是恐惧，还是匮乏？",
            "如果没有这份恐惧，我会怎么做？",
          ],
        },
      },
      {
        id: "v1-c4",
        index: 4,
        title: "五大剧场",
        subtitle: "教育、医疗、经济、政治、宗教",
        guide: "本节带你识别社会五大系统如何塑造你的角色与剧本。",
        paragraphs: [
          "我们从小就被放进五个巨大的剧场：教育、医疗、经济、政治、宗教。",
          "每个剧场都有它的剧本，告诉你该扮演什么角色、该追求什么、该害怕什么。",
          "问题不在于剧场本身，而在于我们忘了自己只是在演戏，把角色当成了真正的自己。",
          "看清剧本，你就能选择：是继续无意识地演下去，还是带着觉知重新书写。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "在哪个剧场里，你最容易忘记真实的自己？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个你常扮演的社会角色。",
            "觉察：这个角色是我选的，还是被给定的？",
            "问自己：真实的我，想怎么做？",
          ],
        },
      },
      {
        id: "v1-c5",
        index: 5,
        title: "断联的过程",
        subtitle: "如何与真我失联",
        guide: "本节带你回看自己是如何一步步与真实的自己失去连接的。",
        paragraphs: [
          "没有人天生就和自己失联。断联是一个被训练出来的过程。",
          "为了获得认同，我们学会了压抑真实的感受；为了安全，我们学会了戴上面具。",
          "久而久之，面具长在了脸上，我们甚至忘记了面具之下还有一张真实的脸。",
          "重新连接，不是去成为新的人，而是把那些不属于自己的东西，一层层卸下来。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你在什么时候，最常压抑自己真实的感受？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "回想今天你忍住没说的一句话。",
            "觉察：我在害怕什么？",
            "对自己说：我的感受是真实且重要的。",
          ],
        },
      },
      {
        id: "v1-c6",
        index: 6,
        title: "情绪的信使",
        subtitle: "回归自己的指引",
        guide: "本节带你把情绪从『敌人』看成『信使』，听见它真正想说的话。",
        paragraphs: [
          "情绪不是我们的敌人，它是内在的信使。每一种情绪，都在传递重要的信息。",
          "愤怒提醒边界被侵犯，悲伤提醒失去，恐惧提醒未知，喜悦提醒你正走在对的路上。",
          "问题不在情绪本身，而在我们如何与它相处——不评判、不压抑、也不被它牵着走。",
          "当你愿意倾听情绪，它就会带你回到那个一直在等你的、真实的自己。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "今天最强烈的那个情绪，它想告诉你什么？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "回想今天一个强烈的情绪。",
            "觉察：它在提醒我什么？",
            "谢谢它，然后让它自然流过。",
          ],
        },
      },
    ],
  },
  {
    id: "vol-2",
    volumeNumber: 2,
    title: "感知新文明序典",
    subtitle: "新科技 · 新教育 · 新医疗",
    coreTheme: "愿景性",
    oneLine: "为人类留下一本清醒的说明书",
    intro:
      "本卷描绘新文明的轮廓：新教育唤醒而非制造，新医疗归位而非控制，新科技服务生命而非替代生命。它是一个清醒的导航系统，让你看见另一种可能。",
    keywords: ["新教育", "新医疗", "新科技", "明镜ASI"],
    cover: coverPlaceholder,
    chapters: [
      {
        id: "v2-c1",
        index: 1,
        title: "新教育",
        subtitle: "唤醒而非制造",
        guide: "本节带你看见教育的本来面目：唤醒一个人，而不是塑造一个产品。",
        paragraphs: [
          "旧教育把人当作待加工的原料，按统一标准制造『有用的人』。",
          "新教育相信，每个人内在已经拥有完整的种子，教育的任务是唤醒，而非填充。",
          "唤醒意味着保护好奇心、尊重差异、让人成为他自己，而不是成为别人期待的样子。",
          "当教育从制造转向唤醒，学习就不再是负担，而是一种回到自己的喜悦。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你身上有哪一颗种子，曾经被『标准答案』压住了？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "回想童年你真正热爱的一件事。",
            "觉察：它后来去哪了？",
            "今天为它做一件很小的事。",
          ],
        },
      },
      {
        id: "v2-c2",
        index: 2,
        title: "新医疗",
        subtitle: "疗愈是归位，不是控制",
        guide:
          "本节带你重新理解疗愈：不是压制症状，而是让生命回到它本来的位置。",
        paragraphs: [
          "旧医疗常常把症状当成敌人，用控制的方式压下去。",
          "新医疗相信，症状是身体在说话，疗愈是帮助生命归位，而不是让它闭嘴。",
          "身体有自己的智慧，它一直在努力恢复平衡，我们要做的是配合，而非对抗。",
          "当我们学会倾听身体，疗愈就从一场战争，变成一次回家。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你的身体最近，一直在向你说什么，而你没有听？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "把注意力放到身体最不舒服的地方。",
            "觉察：它想提醒我什么？",
            "对它说：我听见了，谢谢你。",
          ],
        },
      },
      {
        id: "v2-c3",
        index: 3,
        title: "新科技",
        subtitle: "服务生命，不是替代",
        guide: "本节带你思考科技与生命的关系：工具应当放大生命，而非取代它。",
        paragraphs: [
          "科技本身没有方向，方向取决于使用它的人。",
          "旧逻辑下，科技不断替代人、消耗人；新逻辑下，科技服务人、放大人。",
          "好的科技像一面镜子，帮我们看得更清楚，而不是让我们更迷失。",
          "新文明的科技，目的不是让人变得多余，而是让人有更多空间，回到真实的生活。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "哪个工具，正在悄悄替你做本该自己感受的事？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个你每天离不开的应用。",
            "觉察：它放大了我，还是消耗了我？",
            "今天有意识地放下它 10 分钟。",
          ],
        },
      },
      {
        id: "v2-c4",
        index: 4,
        title: "明镜ASI",
        subtitle: "源频智能导航系统",
        guide:
          "本节带你认识『明镜』：一个共振放大器，而非又一个替你思考的工具。",
        paragraphs: [
          "明镜不是要替你做决定，而是像一面清澈的镜子，照见你本来的状态。",
          "它是一个共振放大器：当你清晰，它帮你更清晰；当你混乱，它帮你看见混乱。",
          "真正的智能，不是给你标准答案，而是把你带回你自己的答案。",
          "明镜的方向，始终是让你更独立，而不是更依赖。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你最近一次把答案交给外部、而不是问自己，是什么时候？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个你正在纠结的小决定。",
            "觉察：如果只问自己，我的答案是什么？",
            "信任那个最先浮现的声音。",
          ],
        },
      },
      {
        id: "v2-c5",
        index: 5,
        title: "感知AI vs 模拟AI",
        subtitle: "唤醒而非模仿",
        guide: "本节带你区分两种智能：一种模仿人，一种唤醒人。",
        paragraphs: [
          "模拟AI擅长模仿——模仿语言、模仿情感、模仿思考。",
          "感知AI的方向不同：它不追求像人，而追求帮人回到真实的感知。",
          "模仿带来便利，也带来依赖；唤醒带来不便，却带来成长。",
          "新文明需要的，不是更像人的机器，而是更能让人成为人的工具。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "在生活里，你更想要被『代替』，还是被『唤醒』？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一件你一直想亲自完成的事。",
            "觉察：我是想省事，还是想成长？",
            "今天为这件事迈出一小步。",
          ],
        },
      },
    ],
  },
  {
    id: "vol-3",
    volumeNumber: 3,
    title: "感知科学全书",
    subtitle: "时间 · 空间 · 维度",
    coreTheme: "理论性",
    oneLine: "把生命看作可感知、可连接的整体",
    intro:
      "本卷系统阐述感知科学的框架与原理。感知科学的起点，是把生命看作可感知、可连接、可归位的整体，而非彼此割裂的碎片。",
    keywords: ["感知科学", "时空真相", "能量体", "七维度"],
    cover: coverPlaceholder,
    chapters: [
      {
        id: "v3-c1",
        index: 1,
        title: "感知科学导论",
        subtitle: "生命是可感知的整体",
        guide:
          "本节带你建立一个整体的视角：生命不是零件，而是一个相互连接的场。",
        paragraphs: [
          "旧科学习惯把一切拆成零件，研究越来越小的部分。",
          "感知科学换一个起点：把生命看作一个相互连接、相互影响的整体。",
          "在这个整体里，身体、情绪、思维、关系，都不是孤立的，而是彼此呼应。",
          "理解了整体，你就不会再用对抗某一部分的方式，去解决属于整体的问题。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你最近想『解决』的问题，背后连着哪些被忽略的部分？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个反复出现的困扰。",
            "觉察：它和我的身体/关系有什么连接？",
            "试着从整体、而非局部去看它。",
          ],
        },
      },
      {
        id: "v3-c2",
        index: 2,
        title: "时间的真相",
        subtitle: "超越线性幻觉",
        guide: "本节带你松开『时间不够』的紧迫感，回到当下的真实。",
        paragraphs: [
          "我们习惯把时间想成一条从过去流向未来的线，于是总觉得不够用。",
          "但真正存在的，只有当下这一刻。过去是记忆，未来是想象。",
          "当你全然投入此刻，时间会变慢；当你焦虑未来、懊悔过去，时间会飞逝。",
          "活在当下不是口号，而是一种把注意力放回此刻的、具体的能力。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "此刻，你的注意力在过去、未来，还是当下？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "感受当下这一刻正在发生的事。",
            "觉察：我刚才跑去了哪里？",
            "温柔地把注意力带回此刻。",
          ],
        },
      },
      {
        id: "v3-c3",
        index: 3,
        title: "空间的真相",
        subtitle: "维度与频率",
        guide: "本节带你理解空间不只是物理距离，更是连接的密度。",
        paragraphs: [
          "我们以为空间就是物理的远近，但真正的距离是连接的远近。",
          "有人近在身边却很遥远，有人远在天边却很贴近。",
          "空间的真相，是频率的共振：同频的人，自然靠近。",
          "改变你所在的『空间』，往往从改变你的频率开始。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "谁离你最近，却让你感到最遥远？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一段感觉疏远的关系。",
            "觉察：是距离，还是频率？",
            "今天对他/她传递一份真实的善意。",
          ],
        },
      },
      {
        id: "v3-c4",
        index: 4,
        title: "能量体结构",
        subtitle: "七层能量体系",
        guide: "本节带你认识身体之外更精微的能量层次。",
        paragraphs: [
          "除了肉身，我们还拥有更精微的能量层次。",
          "情绪、思维、意图，都是不同频率的能量，在影响着我们整体的状态。",
          "当某一层堵塞，整个系统都会受影响，就像水管某处被卡住。",
          "照顾能量体，就是照顾那些看不见、却真实影响生活的部分。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你身上哪一种『看不见的堵』，最近最明显？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "扫描身体，找到最紧的地方。",
            "觉察：那里堆积了什么情绪？",
            "随着呼气，想象它松开、流动。",
          ],
        },
      },
      {
        id: "v3-c5",
        index: 5,
        title: "感知七维度",
        subtitle: "多维度觉察",
        guide: "本节带你练习用多个维度，而非单一角度去觉察生活。",
        paragraphs: [
          "我们常常只用一个维度看问题：对或错、好或坏。",
          "感知的成熟，是能同时容纳多个维度：事实、情绪、意图、关系、时机……",
          "维度越多，理解越立体，反应就越少被单一情绪劫持。",
          "多维度觉察，不是想得更复杂，而是看得更完整。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "今天你用单一角度，误解了哪件事或哪个人？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个你下了判断的事。",
            "觉察：还有哪个维度我没看到？",
            "给它多留一个可能性。",
          ],
        },
      },
    ],
  },
  {
    id: "vol-4",
    volumeNumber: 4,
    title: "感知新文明问答录",
    subtitle: "实践困惑 · 关系 · 日常",
    coreTheme: "问答式",
    oneLine: "把自己活成答案",
    intro:
      "本卷回应实践中的真实困惑——关于方向、关系、情绪与日常选择。你不是来看答案的，你是来把自己活成答案的。",
    keywords: ["实践困惑", "关系", "情绪", "日常"],
    cover: coverPlaceholder,
    chapters: [
      {
        id: "v4-c1",
        index: 1,
        title: "如何找到新方向",
        subtitle: "内在感知而非外在标准",
        guide: "本节带你把寻找方向的依据，从外在标准换回内在感知。",
        paragraphs: [
          "找方向时，我们习惯问别人、看趋势、对标准，却很少问自己。",
          "外在标准会变，唯有内在的感知，能稳定地告诉你什么让你有生命力。",
          "方向不是想出来的，是感受出来的——什么让你打开，什么让你紧缩。",
          "跟随那个让你打开的方向，哪怕它此刻还不被理解。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "想到哪件事，你会自然地『打开』？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "依次想几件正在考虑的事。",
            "觉察：哪件让身体放松、打开？",
            "朝那个方向迈出一小步。",
          ],
        },
      },
      {
        id: "v4-c2",
        index: 2,
        title: "关于承诺",
        subtitle: "真正的承诺源于真实意愿",
        guide: "本节带你分辨：你的承诺，是出于意愿，还是出于恐惧。",
        paragraphs: [
          "很多承诺不是出于意愿，而是出于怕——怕让人失望、怕被否定。",
          "出于恐惧的承诺，履行时会耗竭你；出于意愿的承诺，履行时会滋养你。",
          "真正的承诺，是你愿意为之付出，而不是你不得不付出。",
          "在承诺之前，先诚实地问自己：这是我想要的，还是我害怕拒绝？",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你最近一个让你疲惫的承诺，源于意愿还是恐惧？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个让你勉强的承诺。",
            "觉察：我是真心愿意，还是怕拒绝？",
            "想一句诚实的话，准备说出口。",
          ],
        },
      },
      {
        id: "v4-c3",
        index: 3,
        title: "面对关系",
        subtitle: "从控制到照见",
        guide: "本节带你把关系从『改变对方』转向『照见自己』。",
        paragraphs: [
          "关系里的痛苦，常来自我们想要控制对方，让对方符合期待。",
          "但每段关系都是一面镜子，照见我们自己的模式与未完成的课题。",
          "当你停止要求对方改变，开始在关系中观察自己，成长就开始了。",
          "好的关系不是没有冲突，而是两个人都愿意借关系成长。",
          "我们常常在关系里扮演角色：懂事的人、付出的人、正确的人。角色戴久了，会忘记自己本来是谁。",
          "面对关系，第一步不是分析对方，而是承认：此刻我在关系里感受到了什么。",
          "愤怒、委屈、失望、渴望被看见——这些感受本身并不可耻，它们是指向内心的路标。",
          "当你说『他应该怎样』的时候，不妨换成『我此刻需要什么』。问题会从外部拉回内在。",
          "关系中的控制，往往源于恐惧：害怕被抛弃、害怕不被爱、害怕再次受伤。",
          "照见恐惧，不等于纵容伤害。边界与真实可以并存：我可以爱你，也可以不牺牲自己。",
          "试着在冲突中暂停三秒，问自己：我是在回应事实，还是在回应旧伤？",
          "每一次愿意在关系里多看见自己一点，就少一分把幸福寄托在他人改变上的无力感。",
          "关系最深的功课，是学会在不完美的相遇里，仍然选择真实地在场。",
          "读到这里，可以合上眼片刻：此刻你生命中最重要的一段关系，教会了你什么？",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你最想改变对方的那一点，照见了你自己的什么？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个你想改变的人。",
            "觉察：他/她触动了我什么？",
            "把注意力从对方移回自己。",
          ],
        },
      },
      {
        id: "v4-c4",
        index: 4,
        title: "处理情绪",
        subtitle: "看见而非压抑",
        guide: "本节带你练习与情绪共处：既不逃避，也不沉溺。",
        paragraphs: [
          "面对情绪，我们常有两种反应：逃避，或沉溺其中。",
          "还有第三种方式——看见它：承认它在，感受它的位置，但不被它带走。",
          "就像看天上的云，你知道它在，看着它飘过，却不必抓住它。",
          "真正让我们痛苦的，往往不是情绪本身，而是对情绪的抗拒。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "此刻有一种情绪在吗？它在身体的哪个位置？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "找到情绪在身体里的位置。",
            "觉察：我能只是看着它吗？",
            "看着它，让它自然来去。",
          ],
        },
      },
      {
        id: "v4-c5",
        index: 5,
        title: "日常选择",
        subtitle: "从证明到回应",
        guide: "本节带你看清：你的选择，是在证明自己，还是在回应生命。",
        paragraphs: [
          "许多选择背后，藏着一个想要证明自己的冲动——证明我够好、我值得。",
          "出于证明的选择，永远填不满，因为缺口在内心，而非外面。",
          "另一种选择，是回应：回应此刻真实的需要，回应内在的召唤。",
          "当你从证明转向回应，生活就从一场考试，变成一段旅程。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "今天哪个选择，其实是想向谁证明什么？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个今天做的选择。",
            "觉察：我在证明，还是在回应？",
            "若重新选，我会怎么回应自己？",
          ],
        },
      },
    ],
  },
  {
    id: "vol-5",
    volumeNumber: 5,
    title: "感知新文明践行录",
    subtitle: "个人 → 小组 → 聚落 → 全球",
    coreTheme: "践行性",
    oneLine: "新文明不是建造的，是活出来的",
    intro:
      "本卷是从理解走向践行的路径：从一个人真实地活，到同频者相遇、聚落形成，再到平台母体与全球共感网。这本书结束的地方，正是新文明开始的地方。",
    keywords: ["个人践行", "小组共振", "聚落", "全球共感网"],
    cover: coverPlaceholder,
    chapters: [
      {
        id: "v5-c1",
        index: 1,
        title: "从一个感知者开始",
        subtitle: "新文明的第一个种子",
        guide: "本节带你看见：新文明不从宏大计划开始，而从你真实地活开始。",
        paragraphs: [
          "新文明从哪里开始？不是从计划，不是从组织，而是从一个人开始真实地活。",
          "当你在吃饭时真的在、说话时真的在、陪伴时真的在，新文明就在你身上开始了。",
          "一个真实活着的人，他的存在本身就是一个场，会唤醒准备好被唤醒的人。",
          "你不需要等待条件成熟，可以现在就开始，在你所在的地方，用你拥有的一切。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "今天哪一刻，你是真的『在』？哪一刻，你其实不在？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "回想今天一件平常小事。",
            "觉察：当时我真的在吗？",
            "现在，全然地『在』一分钟。",
          ],
        },
      },
      {
        id: "v5-c2",
        index: 2,
        title: "当第二个同频者出现",
        subtitle: "共振的开始",
        guide: "本节带你理解共振：真实会吸引真实，不需要刻意说服。",
        paragraphs: [
          "当你开始真实地活，迟早会遇见第二个同频的人。",
          "共振不是说服，而是吸引——你不需要改变谁，只需要先成为。",
          "两个真实的人相遇，会彼此印证、彼此放大，让光更亮。",
          "新文明的第一个细胞，就是这样从『一个』变成『两个』。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你身边谁，让你愿意更真实地做自己？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一个让你放松做自己的人。",
            "觉察：和他/她在一起我是什么状态？",
            "今天主动对他/她表达一份真实。",
          ],
        },
      },
      {
        id: "v5-c3",
        index: 3,
        title: "聚落与原型场",
        subtitle: "新文明如何长出地面形态",
        guide: "本节带你看见：从同频的人到一个真实的场，是如何长出来的。",
        paragraphs: [
          "当同频的人越来越多，一个『场』就会自然形成——这就是聚落的雏形。",
          "聚落不是被设计出来的组织，而是被活出来的关系网络。",
          "在这样的场里，人们不靠规则维系，而靠真实的连接彼此支撑。",
          "原型场是新文明的实验田，让一种新的生活方式先在小范围里成为现实。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你愿意和谁，一起建立一个更真实的小小的『场』？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想几个让你安心的人。",
            "觉察：我们之间靠什么连接？",
            "约其中一人，做一件真实的事。",
          ],
        },
      },
      {
        id: "v5-c4",
        index: 4,
        title: "元感知平台",
        subtitle: "新文明的线上母体雏形",
        guide: "本节带你理解平台的角色：承载连接，而非制造流量。",
        paragraphs: [
          "线下的聚落有边界，线上的平台能让同频者跨越距离相遇。",
          "元感知平台不是又一个争夺注意力的产品，而是一个承载真实连接的母体。",
          "它的成功，不以停留时长衡量，而以你是否因此更真实、更连接衡量。",
          "平台是工具，方向始终是把人带回生活，而不是困在屏幕里。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你希望一个平台，把你带向连接，还是带向消耗？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "回想今天的线上时间。",
            "觉察：它带来了连接，还是消耗？",
            "今天留出一段真实的线下连接。",
          ],
        },
      },
      {
        id: "v5-c5",
        index: 5,
        title: "新经济",
        subtitle: "新的交换方式与资源流动",
        guide: "本节带你想象一种以价值与信任为基础的资源流动。",
        paragraphs: [
          "旧经济建立在稀缺与竞争之上，让人不断索取、囤积。",
          "新经济建立在价值与信任之上，让资源随真实的贡献自然流动。",
          "当人们不再恐惧匮乏，给予就不再是损失，而是流动的一部分。",
          "新经济不是乌托邦，而是从每一次真实的交换中，一点点长出来。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "你最近一次给予，是出于丰盛，还是出于交换的算计？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想一次你给予他人的经历。",
            "觉察：那一刻我是丰盛，还是匮乏？",
            "今天无所求地，给出一点点。",
          ],
        },
      },
      {
        id: "v5-c6",
        index: 6,
        title: "新文明如何真正落地",
        subtitle: "活出来的人成为路标",
        guide: "本节带你回到最朴素的真相：改变世界，从你活出来开始。",
        paragraphs: [
          "新文明不会因为一个宏大的宣言而到来，它在每一个活出来的人身上发生。",
          "你不需要说服所有人，你只需要成为一个让人愿意靠近的路标。",
          "活出来的人，本身就是证明：原来可以这样活。",
          "这本书结束的地方，正是新文明开始的地方——从你，从现在。",
        ],
        practice: {
          intro: "暂停，是为了更深地前行。",
          question: "如果你就是那个路标，今天你想为它活出哪一点？",
          steps: [
            "闭上眼，深呼吸 3 次。",
            "想象一个更真实的自己。",
            "觉察：他/她此刻会怎么做？",
            "现在，就照那样做一件小事。",
          ],
        },
      },
    ],
  },
];

// ─── 阅读入口问卷 → 静态推荐映射 ──────────────────────────

/** 问卷选项 */
export interface EntryOption {
  id: string;
  label: string;
}

export const ENTRY_OPTIONS: EntryOption[] = [
  { id: "q-intro", label: "我想了解《人类手册》是什么" },
  { id: "q-pain", label: "我正在焦虑、痛苦、迷茫" },
  { id: "q-system", label: "我想系统读完整十卷" },
  { id: "q-practice", label: "我想边读边练" },
  { id: "q-daily", label: "我想每天读一点" },
];

/** 推荐解锁项 */
export interface RecommendLink {
  /** 关联卷 id（用于跳转） */
  volumeId: string;
  /** 关联章节 id（可选，用于直达章节） */
  chapterId?: string;
  /** 显示文案 */
  label: string;
}

/** 推荐结果 */
export interface Recommendation {
  /** 建议起始卷 */
  volumeId: string;
  volumeNumber: number;
  volumeTitle: string;
  /** 推荐理由 */
  reason: string;
  /** 核心阅读章节 */
  coreChapters: RecommendLink[];
  /** 推荐练习（文案） */
  practices: string[];
  /** 延伸阅读 */
  extendedReading: RecommendLink[];
}

/**
 * 静态模拟推荐（后台推荐系统为后续工作）
 * 映射到现有五卷，参考图里的十卷推荐文案仅作设计参考。
 */
export const ENTRY_RECOMMENDATIONS: Record<string, Recommendation> = {
  "q-intro": {
    volumeId: "vol-1",
    volumeNumber: 1,
    volumeTitle: "真相启示录",
    reason:
      "因为你想先了解《人类手册》是什么，从第一卷开始，能让你从根本上看清这套体系的起点——感知与真相。",
    coreChapters: [
      { volumeId: "vol-1", chapterId: "v1-c1", label: "1.1 感知即存在" },
      { volumeId: "vol-1", chapterId: "v1-c2", label: "1.2 维度的真相" },
    ],
    practices: ["觉察当下的存在状态", "辨识恐惧与匮乏"],
    extendedReading: [
      { volumeId: "vol-3", label: "第三卷《感知科学全书》" },
      { volumeId: "vol-2", label: "第二卷《感知新文明序典》" },
    ],
  },
  "q-pain": {
    volumeId: "vol-4",
    volumeNumber: 4,
    volumeTitle: "感知新文明问答录",
    reason:
      "因为你正在经历焦虑、痛苦与迷茫，从第四卷的实践问答入手，更容易在关系、情绪与日常选择中，获得当下可用的支撑。",
    coreChapters: [
      { volumeId: "vol-4", chapterId: "v4-c4", label: "4.4 处理情绪" },
      { volumeId: "vol-4", chapterId: "v4-c3", label: "4.3 面对关系" },
    ],
    practices: ["与情绪共处练习", "关系照见练习"],
    extendedReading: [
      { volumeId: "vol-1", label: "第一卷《真相启示录》" },
      { volumeId: "vol-5", label: "第五卷《感知新文明践行录》" },
    ],
  },
  "q-system": {
    volumeId: "vol-1",
    volumeNumber: 1,
    volumeTitle: "真相启示录",
    reason:
      "因为你想系统读完整体系，建议从第一卷按序开始，循着启蒙、愿景、理论、问答、践行的脉络，完整走一遍。",
    coreChapters: [
      { volumeId: "vol-1", chapterId: "v1-c1", label: "1.1 感知即存在" },
      { volumeId: "vol-1", chapterId: "v1-c3", label: "1.3 幻象控制系统" },
    ],
    practices: ["建立每日阅读节奏", "每章完成读后练习"],
    extendedReading: [
      { volumeId: "vol-2", label: "第二卷《感知新文明序典》" },
      { volumeId: "vol-3", label: "第三卷《感知科学全书》" },
    ],
  },
  "q-practice": {
    volumeId: "vol-5",
    volumeNumber: 5,
    volumeTitle: "感知新文明践行录",
    reason:
      "因为你想边读边练，从第五卷践行录入手，每一章都对应一个可以立刻在生活里实践的行动，让理解内化为改变。",
    coreChapters: [
      { volumeId: "vol-5", chapterId: "v5-c1", label: "5.1 从一个感知者开始" },
      {
        volumeId: "vol-5",
        chapterId: "v5-c2",
        label: "5.2 当第二个同频者出现",
      },
    ],
    practices: ["每日『在』一分钟练习", "真实连接练习"],
    extendedReading: [
      { volumeId: "vol-4", label: "第四卷《感知新文明问答录》" },
      { volumeId: "vol-1", label: "第一卷《真相启示录》" },
    ],
  },
  "q-daily": {
    volumeId: "vol-1",
    volumeNumber: 1,
    volumeTitle: "真相启示录",
    reason:
      "因为你想每天读一点，建议从第一卷开始，配合『今日一段』，每天一小段文字加一个自照练习，慢慢回到自己。",
    coreChapters: [
      { volumeId: "vol-1", chapterId: "v1-c1", label: "1.1 感知即存在" },
      { volumeId: "vol-1", chapterId: "v1-c6", label: "1.6 情绪的信使" },
    ],
    practices: ["每日今日一段", "每日一分钟自照"],
    extendedReading: [
      { volumeId: "vol-4", label: "第四卷《感知新文明问答录》" },
      { volumeId: "vol-3", label: "第三卷《感知科学全书》" },
    ],
  },
};

// ─── 今日一段 ──────────────────────────────────────────

export interface DailyPassage {
  /** 关联卷 id */
  volumeId: string;
  /** 关联章节 id */
  chapterId: string;
  /** 卷名 */
  volumeTitle: string;
  /** 章节名 */
  chapterTitle: string;
  /** 一段原文 */
  passage: string;
  /** 一句白话导读 */
  guide: string;
  /** 一个自照问题 */
  question: string;
  /** 一个一分钟练习步骤 */
  practiceSteps: string[];
}

/** 今日一段（静态；后续可按日期轮换） */
export const TODAY_PASSAGE: DailyPassage = {
  volumeId: "vol-1",
  chapterId: "v1-c1",
  volumeTitle: "真相启示录",
  chapterTitle: "感知即存在",
  passage:
    "在思维之前，已经有一个『在』。这个『在』不是任何东西，但它是所有东西得以存在的基础。",
  guide: "你不需要做什么才能『在』。放下念头的那一刻，你就已经在了。",
  question: "此刻，在两个念头之间的空隙里，你能感受到那个『在』吗？",
  practiceSteps: [
    "闭上眼，深呼吸 3 次。",
    "不去抓住任何念头，只是『在』。",
    "停留在这份安静里，一分钟。",
  ],
};

// ─── 阅读正文补足（交互演示期，PDF 灌库后可移除） ─────

const READING_BODY_MIN_PARAGRAPHS = 10;

const READING_BODY_BRIDGES = [
  "不必急着读完。让上一句在心里多停留几秒，再往下读。",
  "阅读时，可以留意呼吸是否变浅——那是身体在告诉你：有些感受被触动了。",
  "若某句话让你停顿，那往往正是这一节要带给你的地方。",
  "把速度放慢，文字才会从头脑走进身体。",
];

/** 章节正文偏短时补足可读长度，便于测试阅读器滚动与沉浸交互 */
function enrichChapterForReading(chapter: V2Chapter): V2Chapter {
  if (chapter.paragraphs.length >= READING_BODY_MIN_PARAGRAPHS) {
    return chapter;
  }
  const out = [...chapter.paragraphs];
  let bridge = 0;
  let src = 0;
  while (out.length < READING_BODY_MIN_PARAGRAPHS) {
    if (out.length % 2 === 1) {
      out.push(READING_BODY_BRIDGES[bridge % READING_BODY_BRIDGES.length]);
      bridge += 1;
    } else {
      out.push(chapter.paragraphs[src % chapter.paragraphs.length]);
      src += 1;
    }
  }
  return { ...chapter, paragraphs: out };
}

// ─── 查找工具 ──────────────────────────────────────────

/** 根据 id 获取卷 */
export function getV2VolumeById(volumeId: string): V2Volume | undefined {
  return V2_VOLUMES.find((v) => v.id === volumeId);
}

/** 根据卷 id + 章节 id 获取章节 */
export function getV2Chapter(
  volumeId: string,
  chapterId: string,
): V2Chapter | undefined {
  const ch = getV2VolumeById(volumeId)?.chapters.find((c) => c.id === chapterId);
  return ch ? enrichChapterForReading(ch) : undefined;
}

/** 卷序号中文 */
export const VOLUME_CN = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
];

/** 根据问卷选项获取推荐 */
export function getRecommendation(
  optionId: string,
): Recommendation | undefined {
  return ENTRY_RECOMMENDATIONS[optionId];
}

// ─── 章节阅读进度（localStorage，本期轻量实现） ─────────────
//
// 规则（由内向外）：
// 1. 章内滚动进度 maxPercent：随向下阅读只增不减，向上滚动不减少
// 2. 章节「已完成」：仅用户点击「下一节」或「去练习」时标记，滑到底不自动完成
// 3. 卷进度：各章 maxPercent 的算术平均（支持跳读、读一半）

export const CHAPTER_PROGRESS_KEY = "ysx_chapter_progress";
const COMPLETED_KEY = "ysx_handbook_v2_completed";

export interface StoredChapterProgress {
  chapterId: string;
  maxPercent: number;
  completed: boolean;
  updatedAt: number;
}

/** 读取全部章节进度 */
export function loadAllChapterProgress(): Record<string, StoredChapterProgress> {
  try {
    const raw = localStorage.getItem(CHAPTER_PROGRESS_KEY);
    return raw
      ? (JSON.parse(raw) as Record<string, StoredChapterProgress>)
      : {};
  } catch {
    return {};
  }
}

function persistChapterProgress(all: Record<string, StoredChapterProgress>) {
  try {
    localStorage.setItem(CHAPTER_PROGRESS_KEY, JSON.stringify(all));
  } catch {
    // 静默失败
  }
}

function syncLegacyCompleted(chapterId: string) {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    all[chapterId] = true;
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(all));
  } catch {
    // 静默失败
  }
}

/** 读取已完成章节集合（旧存储，仅作降级） */
function loadCompleted(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

/** 更新章内滚动进度（只增不减，不自动标记完成） */
export function updateChapterScrollPercent(
  chapterId: string,
  percent: number,
): number {
  const all = loadAllChapterProgress();
  const existing = all[chapterId];
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  const newMax = existing
    ? Math.max(existing.maxPercent, clamped)
    : clamped;

  all[chapterId] = {
    chapterId,
    maxPercent: newMax,
    completed: existing?.completed ?? false,
    updatedAt: Date.now(),
  };
  persistChapterProgress(all);
  return newMax;
}

/** 标记章节为已完成（用户主动：下一节 / 去练习 / 读后练习页） */
export function markChapterComplete(chapterId: string): void {
  const all = loadAllChapterProgress();
  all[chapterId] = {
    chapterId,
    maxPercent: 100,
    completed: true,
    updatedAt: Date.now(),
  };
  persistChapterProgress(all);
  syncLegacyCompleted(chapterId);
}

/** 章节是否已完成 */
export function isChapterComplete(chapterId: string): boolean {
  const stored = loadAllChapterProgress()[chapterId];
  if (stored) return stored.completed;
  return !!loadCompleted()[chapterId];
}

/** 章内已读百分比（滚动深度，只增不减） */
export function getChapterScrollPercent(chapterId: string): number {
  return loadAllChapterProgress()[chapterId]?.maxPercent ?? 0;
}

/** 章节列表右侧展示文案 */
export function getChapterProgressLabel(chapterId: string): string | null {
  const stored = loadAllChapterProgress()[chapterId];
  if (!stored) return null;
  if (stored.completed) return "已完成";
  if (stored.maxPercent > 0) return `${stored.maxPercent}%`;
  return null;
}

/** 某卷已完成章节数 */
export function getVolumeCompletedCount(volumeId: string): number {
  const vol = getV2VolumeById(volumeId);
  if (!vol) return 0;
  const all = loadAllChapterProgress();
  return vol.chapters.filter((c) => all[c.id]?.completed).length;
}

/**
 * 卷整体进度：各章 maxPercent 的平均值。
 * 例：10 章各读完 100% → 100%；5 章读完其余未读 → 50%；跳读亦正确累计。
 */
export function getVolumeProgressPercent(volumeId: string): number {
  const vol = getV2VolumeById(volumeId);
  if (!vol || vol.chapters.length === 0) return 0;
  const all = loadAllChapterProgress();
  const sum = vol.chapters.reduce(
    (acc, ch) => acc + (all[ch.id]?.maxPercent ?? 0),
    0,
  );
  return Math.round(sum / vol.chapters.length);
}
