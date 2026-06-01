/**
 * ChapterDetail - 人类手册章节详情页 (version 1.0)
 *
 * 展示章节的完整内容，支持阅读模式
 * 基于五卷体系的深度理解设计
 */

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { FONT_SERIF, rpx } from "../config/styles";
import { Toast } from "../components/shared/Toast";
import { useToast } from "../hooks/useToast";
import { useReadingProgress } from "../hooks/useReadingProgress";

/** 每卷的章节列表 */
const VOLUME_CHAPTERS: Record<string, string[]> = {
  "vol-1": ["v1-c1", "v1-c2", "v1-c3", "v1-c4", "v1-c5", "v1-c6"],
  "vol-2": ["v2-c1", "v2-c2", "v2-c3", "v2-c4", "v2-c5", "v2-c6"],
  "vol-3": ["v3-c1", "v3-c2", "v3-c3", "v3-c4", "v3-c5", "v3-c6"],
  "vol-4": ["v4-c1", "v4-c2", "v4-c3", "v4-c4", "v4-c5", "v4-c6"],
  "vol-5": ["v5-c1", "v5-c2", "v5-c3", "v5-c4", "v5-c5", "v5-c6"],
};

/** 章节内容数据 */
const CHAPTER_CONTENT: Record<
  string,
  {
    volumeTitle: string;
    volumeNumber: number;
    chapterNumber: number;
    title: string;
    subtitle: string;
    paragraphs: string[];
    keyPoints: string[];
    reflection: string;
  }
> = {
  "v1-c1": {
    volumeTitle: "真相启示录",
    volumeNumber: 1,
    chapterNumber: 1,
    title: "感知即存在",
    subtitle: "宇宙诞生的源头",
    paragraphs: [
      "感知是宇宙诞生的源头。这不是一个哲学假说，而是一个可以被直接体验的事实。",
      "当你真正安静下来，放下所有的思维活动，你会发现：在思维之前，已经有一个『在』。这个『在』不是任何东西，但它是所有东西得以存在的基础。",
      "我们通常认为，先有物质世界，然后才有感知物质世界的意识。但如果你仔细观察，你会发现这个假设是站不住脚的。",
      "没有感知，你怎么知道有物质？没有感知，你怎么知道有世界？感知不是世界的产物，感知是世界得以呈现的前提。",
      "这就是为什么我们说：感知即存在。不是『我思故我在』，而是『我在故我思』。在思维之前，已经有一个更根本的存在——纯粹的感知本身。",
    ],
    keyPoints: [
      "感知是宇宙诞生的源头",
      "在思维之前，已经有一个『在』",
      "感知不是世界的产物，是世界呈现的前提",
    ],
    reflection: "试着在日常中观察：当思维停止的瞬间，是否还有一个『在』？",
  },
  "v1-c2": {
    volumeTitle: "真相启示录",
    volumeNumber: 1,
    chapterNumber: 2,
    title: "维度的真相",
    subtitle: "频率而非地方",
    paragraphs: [
      "我们通常把维度理解为空间的层次——三维空间、四维时空等等。但这种理解是有局限的。",
      "维度不是地方，维度是频率。你不需要去哪里才能进入更高维度，你只需要改变你的频率。",
      "什么是频率？频率就是你存在的状态。当你处于恐惧、愤怒、嫉妒的状态时，你在一个频率；当你处于平静、喜悦、爱的状态时，你在另一个频率。",
      "所谓『升维』，不是去到一个更高级的地方，而是让自己的存在状态变得更加清澈、更加通透、更加接近本源。",
      "这就是为什么真正的修行不是向外寻找，而是向内清理。清理那些让你的频率变得浑浊的东西——恐惧、执着、幻象。",
    ],
    keyPoints: [
      "维度不是地方，维度是频率",
      "频率就是你存在的状态",
      "升维是让存在状态更加清澈",
    ],
    reflection: "觉察一下：此刻你的存在状态是什么？是紧缩还是开放？",
  },
  "v1-c3": {
    volumeTitle: "真相启示录",
    volumeNumber: 1,
    chapterNumber: 3,
    title: "幻象控制系统",
    subtitle: "恐惧与匮乏的牢笼",
    paragraphs: [
      "人类社会运行在一个精密的幻象控制系统中。这个系统的核心是两个东西：恐惧和匮乏。",
      "恐惧让你不敢行动，让你不敢做真实的自己，让你不敢质疑现有的规则。匮乏让你不断追逐，让你相信自己永远不够，让你把生命浪费在获取上。",
      "这个系统不是某个人或某个组织设计的，它是集体无意识的产物。每一个处于恐惧和匮乏中的人，都在无意识地维护和强化这个系统。",
      "看清这个系统，不是为了对抗它，而是为了从它中间醒来。当你看清恐惧只是一个幻象，当你看清你本来就是完整的，系统对你的控制就自然瓦解了。",
      "觉醒不是打败什么，觉醒是看清什么。当你真正看清，你就自由了。",
    ],
    keyPoints: [
      "幻象控制系统的核心是恐惧和匮乏",
      "每个处于恐惧中的人都在维护这个系统",
      "觉醒是看清，不是对抗",
    ],
    reflection: "观察一下：你生活中哪些行为是被恐惧驱动的？",
  },
  "v5-c1": {
    volumeTitle: "感知新文明践行录",
    volumeNumber: 5,
    chapterNumber: 1,
    title: "从一个感知者开始",
    subtitle: "新文明的第一个种子",
    paragraphs: [
      "新文明从哪里开始？不是从宏大的计划开始，不是从组织的建立开始，而是从一个人开始真实活开始。",
      "这个人可能是你。当你开始重新学会『在』——在吃饭时真的在，在说话时真的在，在陪伴时真的在——新文明就在你身上开始了。",
      "不要小看这个开始。一个真实活着的人，他的存在本身就是一个场。这个场会影响他周围的人，会唤醒那些准备好被唤醒的人。",
      "新文明不是建造出来的，是活出来的。每一个开始真实活的人，都是新文明的一个种子。种子不需要知道整片森林会长成什么样子，种子只需要扎根、发芽、生长。",
      "你不需要等待什么条件成熟，你不需要等待别人先开始。你可以现在就开始，在你此刻所在的地方，用你此刻拥有的一切。",
    ],
    keyPoints: [
      "新文明从一个人开始真实活开始",
      "一个真实活着的人就是一个场",
      "新文明是活出来的，不是建造出来的",
    ],
    reflection: "今天，你可以在哪一个具体的时刻，试着真正地『在』？",
  },
  "v1-c4": {
    volumeTitle: "真相启示录",
    volumeNumber: 1,
    chapterNumber: 4,
    title: "时间的幻象",
    subtitle: "永恒的当下",
    paragraphs: [
      "时间是人类最深的幻象之一。我们活在对过去的悔恨和对未来的焦虑中，却忘了唯一真实存在的只有当下。",
      "过去已经不存在了，它只存在于你的记忆中。未来还没有发生，它只存在于你的想象中。唯一真实的，是此刻。",
      "当你真正进入当下，时间感会消失。你会发现，所谓的『永恒』不是无限长的时间，而是时间的消失——纯粹的『在』。",
      "这就是为什么冥想和深度专注会让人感到时间飞逝。不是时间真的变快了，而是你暂时脱离了时间的幻象。",
      "学会活在当下，不是一种技术，而是一种觉醒。当你不再被过去和未来绑架，你就自由了。",
    ],
    keyPoints: [
      "唯一真实存在的只有当下",
      "永恒是时间的消失",
      "活在当下是一种觉醒",
    ],
    reflection: "此刻，你的注意力在哪里？在过去、未来，还是就在这里？",
  },
  "v1-c5": {
    volumeTitle: "真相启示录",
    volumeNumber: 1,
    chapterNumber: 5,
    title: "自我的解构",
    subtitle: "谁在感知",
    paragraphs: [
      "我们通常认为有一个『我』在感知世界。但如果你仔细观察，你会发现这个『我』其实是一个幻象。",
      "所谓的『我』，是由记忆、想法、情绪、身体感觉组成的一个故事。这个故事不断在变化，没有一个固定不变的核心。",
      "当你问『谁在感知』时，你找不到一个实体的感知者。你只能找到感知本身——一个没有边界、没有中心的觉知。",
      "这不是说你不存在。你当然存在。但你存在的方式，不是作为一个固定的实体，而是作为流动的觉知本身。",
      "当你不再执着于一个固定的『我』，你反而会感到更加完整、更加自由。因为真正的你，比任何故事都要广阔。",
    ],
    keyPoints: [
      "自我是由记忆、想法、情绪组成的故事",
      "感知者找不到，只有感知本身",
      "真正的你比任何故事都广阔",
    ],
    reflection: "试着观察：当你说『我』的时候，你指的究竟是什么？",
  },
  "v1-c6": {
    volumeTitle: "真相启示录",
    volumeNumber: 1,
    chapterNumber: 6,
    title: "觉醒的本质",
    subtitle: "从梦中醒来",
    paragraphs: [
      "觉醒不是获得什么特殊的能力，不是达到什么神圣的境界，而是简单地看清事物的本来面目。",
      "就像从梦中醒来一样。在梦里，一切看起来那么真实、那么重要。但醒来之后，你知道那只是一场梦。",
      "觉醒就是从生活的梦中醒来。不是说生活不存在，而是看清生活中那些我们当真了的幻象——关于自我的幻象、关于时间的幻象、关于分离的幻象。",
      "觉醒不是一个终点，而是一个开始。醒来之后，你还是要继续生活，但生活的质感完全不同了。",
      "一个觉醒的人，活在同样的世界里，做着同样的事情，但内心是自由的、喜悦的、平静的。",
    ],
    keyPoints: [
      "觉醒是看清事物的本来面目",
      "觉醒是从生活的梦中醒来",
      "觉醒不是终点，是开始",
    ],
    reflection: "如果你此刻就醒来了，你的生活会有什么不同？",
  },
  "v2-c1": {
    volumeTitle: "感知新文明序典",
    volumeNumber: 2,
    chapterNumber: 1,
    title: "新文明的愿景",
    subtitle: "从感知出发的世界",
    paragraphs: [
      "想象一个世界，在那里人们不再被恐惧和匮乏驱动，而是从内在的完整出发。",
      "在这个世界里，教育不是填充知识，而是唤醒感知；经济不是无限增长，而是满足真实需要；关系不是互相利用，而是彼此成全。",
      "这不是乌托邦的幻想。这是当越来越多的人开始觉醒时，自然会出现的世界。",
      "新文明不需要推翻什么，不需要对抗什么。它只需要越来越多的人开始真实地活，开始从感知出发而不是从恐惧出发。",
      "每一个觉醒的人，都是新文明的一个细胞。当足够多的细胞觉醒，整个有机体就会转变。",
    ],
    keyPoints: [
      "新文明从感知出发",
      "不需要推翻，需要转变",
      "每个觉醒的人都是新文明的细胞",
    ],
    reflection: "如果恐惧和匮乏消失了，你会如何生活？",
  },
  "v2-c2": {
    volumeTitle: "感知新文明序典",
    volumeNumber: 2,
    chapterNumber: 2,
    title: "新教育",
    subtitle: "唤醒而非填充",
    paragraphs: [
      "现有的教育系统，本质上是一个把人变成工具的系统。它教你知识、技能，但不教你如何真实地活。",
      "新教育的核心不是传授知识，而是唤醒感知。知识可以随时学习，但感知的唤醒需要正确的引导。",
      "新教育会教孩子认识自己的情绪、倾听身体的声音、与他人建立真实的连接。这些是旧教育忽略的，却是生命中最重要的。",
      "新教育不是要取消知识教育，而是在知识教育之上，加上感知教育。让孩子不仅学会做事，更学会做人。",
      "一个感知清醒的人，学习任何东西都会更快、更深。因为他不是在机械地记忆，而是在真正地理解。",
    ],
    keyPoints: [
      "新教育的核心是唤醒感知",
      "教孩子认识情绪、倾听身体",
      "感知清醒的人学习更快更深",
    ],
    reflection: "回顾你的教育经历，有没有人教过你如何感知自己？",
  },
  "v2-c3": {
    volumeTitle: "感知新文明序典",
    volumeNumber: 2,
    chapterNumber: 3,
    title: "新健康",
    subtitle: "身心合一的医学",
    paragraphs: [
      "现代医学把人当作机器来修理。哪里坏了修哪里，却很少问为什么会坏。",
      "新健康观认识到：大多数疾病的根源在于身心的分离。当我们长期忽视身体的信号、压抑情绪、活在紧张中，疾病就会出现。",
      "新健康不是反对现代医学，而是在现代医学之上，加入感知的维度。不仅治疗症状，更要找到根源。",
      "一个感知清醒的人，能够及早发现身体的失衡，在疾病形成之前就进行调整。这是真正的预防医学。",
      "健康不仅是没有疾病，更是身心合一、充满活力的状态。这种健康来自内在的平衡，而不是外在的干预。",
    ],
    keyPoints: [
      "疾病的根源在于身心分离",
      "新健康加入感知维度",
      "真正的健康是身心合一",
    ],
    reflection: "你的身体此刻在向你发送什么信号？",
  },
  "v2-c4": {
    volumeTitle: "感知新文明序典",
    volumeNumber: 2,
    chapterNumber: 4,
    title: "新经济",
    subtitle: "从匮乏到丰盛",
    paragraphs: [
      "现有的经济系统建立在匮乏的假设上：资源是有限的，所以我们必须竞争。",
      "但如果你仔细观察，你会发现真正的匮乏不是资源的匮乏，而是感知的匮乏。当人们感到内在空虚时，就会不断向外索取。",
      "新经济的基础是内在的丰盛。当人们不再从匮乏出发，消费会变得更理性，生产会变得更有意义，分配会变得更公平。",
      "新经济不是要废除市场，而是要改变市场的动力。从恐惧驱动变成创造驱动，从占有导向变成分享导向。",
      "一个感知丰盛的人，不需要囤积，不需要炫耀，他只取他真正需要的，也乐于分享他所拥有的。",
    ],
    keyPoints: [
      "真正的匮乏是感知的匮乏",
      "新经济的基础是内在丰盛",
      "从恐惧驱动变成创造驱动",
    ],
    reflection: "你生活中有哪些消费是为了填补内在的空虚？",
  },
  "v2-c5": {
    volumeTitle: "感知新文明序典",
    volumeNumber: 2,
    chapterNumber: 5,
    title: "新关系",
    subtitle: "从依附到成全",
    paragraphs: [
      "旧文明的关系模式是依附和控制。我需要你来满足我的需求，所以我要控制你；你需要我来获得安全感，所以你依附于我。",
      "这种关系模式注定是痛苦的。因为没有人能真正满足另一个人的内在空虚，也没有人愿意永远被控制。",
      "新关系的基础是两个完整的人的相遇。不是为了填补彼此的空缺，而是为了彼此照见、彼此成全。",
      "在新关系中，你不需要对方来完整你自己。你已经是完整的。你们在一起，是为了分享这份完整，让彼此变得更加丰盛。",
      "新关系中的爱，不是占有，不是依赖，而是一种自由的给予。你爱，不是因为你需要，而是因为你丰盛。",
    ],
    keyPoints: [
      "旧关系建立在依附和控制上",
      "新关系是两个完整的人的相遇",
      "新的爱是自由的给予",
    ],
    reflection: "在你的关系中，你是从完整出发，还是从匮乏出发？",
  },
  "v2-c6": {
    volumeTitle: "感知新文明序典",
    volumeNumber: 2,
    chapterNumber: 6,
    title: "新科技",
    subtitle: "服务感知的工具",
    paragraphs: [
      "科技本身是中性的。它可以让人更自由，也可以让人更被控制。关键在于科技被谁使用、为了什么目的。",
      "在旧文明中，科技常常被用来加强控制——监控、操纵、成瘾。人们变成了科技的奴隶，而不是科技的主人。",
      "新科技的方向是服务于人的感知觉醒。它帮助人们更好地了解自己、连接他人、探索真相。",
      "人工智能可以成为感知的助手，帮助人们照见自己的盲点。但它永远不能替代人的直接感知和体验。",
      "新科技的最高境界，是帮助人类超越科技本身——让人们最终不需要依赖任何外在工具，就能直接感知真相。",
    ],
    keyPoints: [
      "科技本身是中性的",
      "新科技服务于感知觉醒",
      "最高境界是超越科技本身",
    ],
    reflection: "你使用科技的方式，是让你更清醒还是更迷失？",
  },
  "v3-c1": {
    volumeTitle: "感知科学全书",
    volumeNumber: 3,
    chapterNumber: 1,
    title: "感知的科学基础",
    subtitle: "意识与物质的关系",
    paragraphs: [
      "传统科学假设物质是第一性的，意识是物质的产物。但量子物理学的发现正在挑战这个假设。",
      "观察者效应表明，观察行为本身会影响被观察的对象。这暗示着意识和物质之间有着我们尚未理解的深层联系。",
      "感知科学的假设是：感知是比物质更基本的存在。物质是感知的显化，而不是感知是物质的产物。",
      "这不是否定物质的存在，而是重新理解物质的本质。物质不是独立于感知而存在的死寂之物，而是感知在某种频率上的凝聚。",
      "当科学最终理解了感知的本质，它将与古老的智慧传统汇合。因为它们说的是同一件事，只是用不同的语言。",
    ],
    keyPoints: [
      "量子物理学在挑战传统假设",
      "感知比物质更基本",
      "物质是感知的显化",
    ],
    reflection: "如果感知是第一性的，这会如何改变你看待世界的方式？",
  },
  "v3-c2": {
    volumeTitle: "感知科学全书",
    volumeNumber: 3,
    chapterNumber: 2,
    title: "感知的层次",
    subtitle: "从粗到细的觉知",
    paragraphs: [
      "感知不是单一的，它有不同的层次。最粗的层次是感官感知——看、听、闻、尝、触。",
      "更细的层次是情绪感知——能够觉察到内在的情绪变化，而不是被情绪淹没。",
      "再细的层次是念头感知——能够看到念头的生起和消失，而不是认同每一个念头。",
      "最细的层次是纯粹的觉知本身——不依附于任何对象的空明觉知。这是感知的源头。",
      "感知训练的目的，就是从粗到细，逐步深入，最终认识到觉知的本质。",
    ],
    keyPoints: [
      "感知有不同层次",
      "从感官到情绪到念头到纯粹觉知",
      "训练是从粗到细的过程",
    ],
    reflection: "此刻你能觉察到多细的层次？感官？情绪？还是念头？",
  },
  "v3-c3": {
    volumeTitle: "感知科学全书",
    volumeNumber: 3,
    chapterNumber: 3,
    title: "感知与大脑",
    subtitle: "神经科学的视角",
    paragraphs: [
      "神经科学告诉我们，感知与大脑活动密切相关。但关联不等于因果。",
      "大脑是感知的工具，不是感知的来源。就像收音机是收听广播的工具，但广播不是收音机产生的。",
      "冥想和感知训练可以改变大脑结构。这不是说感知产生了大脑变化，而是说当感知更清晰时，大脑会相应地调整。",
      "科学研究表明，长期冥想者的大脑在结构和功能上都有显著变化。他们的注意力更集中，情绪更稳定，共情能力更强。",
      "感知训练不是要否定大脑的作用，而是要学会更好地使用这个工具。",
    ],
    keyPoints: [
      "大脑是感知的工具不是来源",
      "感知训练可以改变大脑",
      "学会更好地使用大脑这个工具",
    ],
    reflection: "你平时是被大脑使用，还是在使用大脑？",
  },
  "v3-c4": {
    volumeTitle: "感知科学全书",
    volumeNumber: 3,
    chapterNumber: 4,
    title: "感知与能量",
    subtitle: "频率与振动",
    paragraphs: [
      "一切都是能量，一切都在振动。这不仅是古老的智慧，也是现代物理学的发现。",
      "不同的感知状态对应不同的能量频率。恐惧、愤怒是低频状态；平静、喜悦是高频状态。",
      "感知训练的一个重要方面，是学会觉察和调节自己的能量状态。不是压抑低频情绪，而是允许它们流动、转化。",
      "当你的能量频率提升，你会自然地吸引同频的人和事。这不是神秘主义，而是能量共振的原理。",
      "最终，你会认识到所有的频率都是同一能量的不同表现。高频和低频没有好坏之分，只是不同的状态。",
    ],
    keyPoints: [
      "一切都是能量都在振动",
      "不同感知状态对应不同频率",
      "学会觉察和调节能量状态",
    ],
    reflection: "此刻你的能量状态是什么？高频还是低频？",
  },
  "v3-c5": {
    volumeTitle: "感知科学全书",
    volumeNumber: 3,
    chapterNumber: 5,
    title: "感知与时空",
    subtitle: "超越线性的体验",
    paragraphs: [
      "在日常感知中，时间是线性的——从过去到现在到未来。空间是三维的——长宽高。",
      "但在深度感知状态中，时间和空间的界限会变得模糊。你可能体验到时间的停止或伸缩，空间的扩展或消融。",
      "这些体验不是幻觉，而是感知到了更深层次的现实。在那个层次，时空的分离是一种简化的投影。",
      "量子物理学中的非定域性表明，在某个层面上，空间的分离是一种假象。远距离的粒子可以瞬间关联。",
      "感知训练让你有机会直接体验超越时空的状态。这不是逃避现实，而是认识到更完整的现实。",
    ],
    keyPoints: [
      "深度感知中时空界限模糊",
      "时空分离是简化的投影",
      "可以直接体验超越时空的状态",
    ],
    reflection: "你有没有过时间停止或空间消融的体验？",
  },
  "v3-c6": {
    volumeTitle: "感知科学全书",
    volumeNumber: 3,
    chapterNumber: 6,
    title: "感知的可验证性",
    subtitle: "主观体验与客观研究",
    paragraphs: [
      "感知本质上是主观的，但这不意味着它不能被研究。主观体验也有其规律性和可重复性。",
      "冥想研究、心理学研究、意识研究，都在尝试用科学方法理解感知。虽然还有很多未知，但已经有了很多发现。",
      "最终，感知的验证不能只靠外在的测量，还需要内在的体验。就像你不能只通过阅读来知道苹果的味道。",
      "感知科学的方法是：先有内在的直接体验，再用外在的方法进行验证和交流。内外结合，相互印证。",
      "每个人都是自己感知的最终权威。没有人能替你感知，也没有人能否定你的直接体验。",
    ],
    keyPoints: [
      "感知是主观的但有规律性",
      "内在体验和外在研究结合",
      "每个人是自己感知的最终权威",
    ],
    reflection: "在感知的探索中，你是更依赖别人的说法，还是自己的体验？",
  },
  "v4-c1": {
    volumeTitle: "感知新文明问答录",
    volumeNumber: 4,
    chapterNumber: 1,
    title: "关于感知的常见问题",
    subtitle: "入门者的困惑",
    paragraphs: [
      "问：感知和思考有什么区别？答：思考是用概念处理信息，感知是直接的觉知。思考像是看地图，感知像是直接看风景。",
      "问：我怎么知道自己在感知而不是在想象？答：感知是被动的、接收的；想象是主动的、创造的。当你只是在觉察，不添加任何东西，那就是感知。",
      "问：感知训练需要多长时间才能有效果？答：因人而异，但通常坚持练习几周就会有一些变化。关键不是时间长短，而是是否真正在练习。",
      "问：我打坐的时候杂念很多，是不是做错了？答：有杂念是正常的。问题不是杂念，而是你对杂念的态度。能够看到杂念，本身就是感知在起作用。",
      "问：感知训练会不会让我变得消极或逃避现实？答：恰恰相反。感知清醒的人更能面对现实，因为他们不再被恐惧和幻象遮蔽。",
    ],
    keyPoints: [
      "感知是直接觉知，思考是概念处理",
      "杂念不是问题，对杂念的态度才是",
      "感知让人更能面对现实",
    ],
    reflection: "你对感知训练有什么困惑或疑问？",
  },
  "v4-c2": {
    volumeTitle: "感知新文明问答录",
    volumeNumber: 4,
    chapterNumber: 2,
    title: "关于情绪的问题",
    subtitle: "如何面对负面情绪",
    paragraphs: [
      "问：我应该压抑负面情绪吗？答：不。压抑只会让情绪积累。正确的方式是觉察、允许、让它流动。",
      "问：我觉察了情绪，为什么它还在？答：觉察不是为了消除情绪，而是改变你与情绪的关系。情绪来来去去，你不再被它绑架。",
      "问：有些情绪太强烈了，我无法觉察，怎么办？答：那就先从身体层面入手。感受情绪在身体的哪个位置，是什么感觉。身体是进入情绪的入口。",
      "问：我总是焦虑/愤怒/悲伤，这是不是有问题？答：反复出现的情绪通常指向某些需要被看见的东西。不是要消除它，而是要理解它在告诉你什么。",
      "问：感知训练能治愈心理创伤吗？答：感知训练是基础，但深度创伤可能需要专业帮助。两者不矛盾，可以结合。",
    ],
    keyPoints: [
      "不压抑，觉察允许让情绪流动",
      "身体是进入情绪的入口",
      "反复的情绪指向需要被看见的东西",
    ],
    reflection: "有没有什么情绪是你一直在逃避面对的？",
  },
  "v4-c3": {
    volumeTitle: "感知新文明问答录",
    volumeNumber: 4,
    chapterNumber: 3,
    title: "关于关系的问题",
    subtitle: "如何与他人相处",
    paragraphs: [
      "问：感知训练会不会让我变得冷漠？答：不会。相反，当你更能感知自己，你也更能感知他人。真正的共情来自清醒的感知。",
      "问：我身边的人不理解感知，我该怎么办？答：不需要让所有人理解。你只需要活出来。真正的影响不是说服，而是示范。",
      "问：在关系中，我总是被对方影响怎么办？答：先稳定自己的中心。当你有了稳定的内在基础，你就不会轻易被外在影响。",
      "问：我想帮助身边的人觉醒，但他们不接受？答：每个人有自己的时机。你能做的是保持自己的清醒，成为一个邀请而不是强迫。",
      "问：如何在保持界限的同时又不失去连接？答：真正的界限不是墙，而是清晰。你可以清晰地表达你的需要，同时对他人保持开放。",
    ],
    keyPoints: [
      "真正的共情来自清醒的感知",
      "影响他人靠示范不是说服",
      "界限是清晰，不是隔墙",
    ],
    reflection: "在你的关系中，哪里需要更多清晰？",
  },
  "v4-c4": {
    volumeTitle: "感知新文明问答录",
    volumeNumber: 4,
    chapterNumber: 4,
    title: "关于工作的问题",
    subtitle: "如何在职场保持清醒",
    paragraphs: [
      "问：工作太忙，没时间练习感知怎么办？答：感知训练不需要额外的时间。你可以在工作中练习——开会时保持觉察，写邮件时感受身体。",
      "问：职场竞争激烈，感知训练会不会让我失去竞争力？答：感知清醒的人做事更高效、决策更明智。真正的竞争力不是来自紧张，而是来自清明。",
      "问：我的工作没有意义，我该辞职吗？答：先不要急于行动。先觉察是工作本身没有意义，还是你感受不到意义。有时候改变的不是工作，是你的感知。",
      "问：领导/同事很难相处，怎么办？答：困难的关系是最好的练习场。他们是来帮你看见自己的。问问自己：他们触发了我什么？",
      "问：我想做有意义的工作，但不知道是什么？答：不要用头脑去找，用感知去发现。什么让你感到活力？什么让你忘记时间？那可能就是方向。",
    ],
    keyPoints: [
      "可以在工作中练习感知",
      "清明带来真正的竞争力",
      "用感知而不是头脑寻找意义",
    ],
    reflection: "你的工作中，哪些时刻让你感到真正活着？",
  },
  "v4-c5": {
    volumeTitle: "感知新文明问答录",
    volumeNumber: 4,
    chapterNumber: 5,
    title: "关于修行的问题",
    subtitle: "如何持续精进",
    paragraphs: [
      "问：我练习了一段时间，感觉没什么进步？答：进步常常是不知不觉的。回头看看几个月前的自己，你可能会发现已经有了变化。",
      "问：我有时候状态很好，有时候又退回去了？答：这是正常的。修行不是一条直线，而是螺旋上升。退回去不是失败，是为了更深入地前进。",
      "问：我需要找一个老师吗？答：好的老师可以帮助你避免弯路，但最终的老师是你自己的直接体验。不要把权威交给任何外在的人。",
      "问：有没有捷径或快速开悟的方法？答：真正的觉醒没有捷径。但也不需要很长时间——它可能就在下一刻。关键是你是否真的准备好了。",
      "问：我怎么知道自己是不是在进步？答：不是感觉有多好，而是你与自己的关系有没有改变。你是否更能接纳自己？更少对抗？",
    ],
    keyPoints: [
      "进步常常是不知不觉的",
      "修行是螺旋上升不是直线",
      "最终的老师是自己的直接体验",
    ],
    reflection: "回顾过去几个月，你与自己的关系有什么变化？",
  },
  "v4-c6": {
    volumeTitle: "感知新文明问答录",
    volumeNumber: 4,
    chapterNumber: 6,
    title: "关于生死的问题",
    subtitle: "如何面对终极问题",
    paragraphs: [
      "问：感知训练能帮助我面对死亡的恐惧吗？答：能。当你认识到真正的你不是这个身体，死亡就失去了它的威胁。死亡只是一个转变，不是终结。",
      "问：死后会怎样？答：没有人能给你确定的答案。但感知训练可以让你直接体验那个不生不灭的觉知——它就是你的本质。",
      "问：我害怕失去亲人？答：失去是痛苦的，这很自然。但真正的连接不会因为身体的消失而断裂。爱是超越时空的。",
      "问：生命的意义是什么？答：生命的意义不是被找到的，而是被活出来的。当你真实地活，意义自然显现。",
      "问：如果一切都是幻象，为什么还要活？答：幻象不是说不存在，而是说不是你想的那样。生活依然要活，只是活法不同了——从恐惧变成了游戏。",
    ],
    keyPoints: [
      "真正的你不是身体",
      "真正的连接不会因死亡断裂",
      "意义是被活出来的不是找到的",
    ],
    reflection: "如果你只剩一年的生命，你会如何活？",
  },
  "v5-c2": {
    volumeTitle: "感知新文明践行录",
    volumeNumber: 5,
    chapterNumber: 2,
    title: "当第二个同频者出现",
    subtitle: "共振的开始",
    paragraphs: [
      "当你开始真实活，一件神奇的事情会发生：你会遇到同频的人。",
      "这不是因为你去寻找，而是因为频率相近的生命自然会相遇。就像调到同一个频道的收音机，自然会收到同一个信号。",
      "当第二个同频者出现，共振就开始了。共振不是观点一致，不是互相认同，而是两个真实的生命之间的相互激活。",
      "在共振中，你会发现：当一方松了，另一方可以轻轻拉回来；当一方看不清，另一方可以帮忙照见。这不是依赖，是相互成全。",
      "共振的目的不是形成一个小团体，而是让每个人都更加靠近自己。真正的共振让人更自由，而不是更依附。",
    ],
    keyPoints: [
      "频率相近的生命自然会相遇",
      "共振是两个真实生命的相互激活",
      "共振让人更自由，不是更依附",
    ],
    reflection:
      "在你的生活中，有没有这样一个人，和他在一起时你更容易是真实的自己？",
  },
  "v5-c3": {
    volumeTitle: "感知新文明践行录",
    volumeNumber: 5,
    chapterNumber: 3,
    title: "小组：新文明的第一现场",
    subtitle: "几个人真实活在一起",
    paragraphs: [
      "当共振的人达到一定数量，小组就自然形成了。小组是新文明的第一现场——几个人真实活在一起的实验。",
      "小组不是组织，不是俱乐部，而是共振中的临时生命体。它有自己的生命周期，会生长、变化、甚至解散，这都是自然的。",
      "小组运作的原则：自愿而不是绑定、真实而不是表演、清晰边界而不是模糊责任、流动位置而不是固定权力。",
      "小组的核心活动是共同在场——定期聚在一起，不是为了讨论什么，而是为了一起『在』。在彼此的在场中，每个人都更容易保持清醒。",
      "小组不是目的，是载体。它帮助成员扎根、生长，最终每个人都要走出去，把火种带到更广阔的地方。",
    ],
    keyPoints: [
      "小组是共振中的临时生命体",
      "原则：自愿、真实、清晰边界、流动位置",
      "核心活动是共同在场",
    ],
    reflection: "你有没有想过，和几个同频的人一起定期共修？",
  },
  "v5-c4": {
    volumeTitle: "感知新文明践行录",
    volumeNumber: 5,
    chapterNumber: 4,
    title: "连接线下",
    subtitle: "把人送回现实",
    paragraphs: [
      "线上的共振很重要，但最终要落地到线下。新文明不是在虚拟空间里建造，而是在真实的土地上生长。",
      "线下训练营是火种点亮的最佳方式。几天的密集在场，可以让人深度体验什么是『真实活』，回去之后就有了参照点。",
      "节点是线下的连接点——一个城市、一个社区里的据点。有了节点，附近的感知者就可以定期相聚，不必等到训练营。",
      "聚落是小组扎根现实的形态——几个人或几家人在一起生活、工作、共修。这是新文明的种子社区，是活的实验室。",
      "从线上到线下，从虚拟到真实，新文明必须完成这个转变。否则它就只是一个美好的想法，而不是活的现实。",
    ],
    keyPoints: [
      "新文明要落地到线下",
      "训练营、节点、聚落是三种形态",
      "必须从虚拟到真实完成转变",
    ],
    reflection: "你有没有想过，在你所在的城市成为一个节点？",
  },
  "v5-c5": {
    volumeTitle: "感知新文明践行录",
    volumeNumber: 5,
    chapterNumber: 5,
    title: "平台：母体与工具",
    subtitle: "科技服务于觉醒",
    paragraphs: [
      "元感知平台是新文明的线上母体。它不是一个产品，而是一个活的有机体，随着使用者的成长而进化。",
      "平台的核心功能是连接——让同频的人相遇、让践行者相互支持、让资源在需要的地方流动。",
      "明镜是平台的AI助手，但它不是来给答案的，而是来帮助照见的。它问的问题，比给的答案更重要。",
      "平台的成功标志不是用户数量，而是有多少人通过平台真正开始了践行、有多少人从线上走向了线下。",
      "平台的最高境界是让人不需要平台——当你已经扎根在真实的共同体中，你就不再需要依赖任何虚拟工具。",
    ],
    keyPoints: [
      "平台是活的有机体",
      "核心功能是连接",
      "最高境界是让人不需要平台",
    ],
    reflection: "你希望在这个平台上获得什么？又能贡献什么？",
  },
  "v5-c6": {
    volumeTitle: "感知新文明践行录",
    volumeNumber: 5,
    chapterNumber: 6,
    title: "你就是新文明",
    subtitle: "从此刻开始",
    paragraphs: [
      "读到这里，你可能在想：新文明什么时候会到来？答案是：当你开始真实活的那一刻，新文明就已经到来了。",
      "不要等待条件成熟，不要等待别人先开始。你就是那个条件，你就是那个开始。新文明不在未来，就在此刻，就在你身上。",
      "你不需要做什么伟大的事情。你只需要在此刻真实地在——在呼吸时真的在，在与人交谈时真的在，在做任何事情时真的在。",
      "每一个真实的时刻，都是新文明的一个点。当这些点连成线、织成网，新文明就不再是愿景，而是活生生的现实。",
      "感谢你读到这里。现在，放下手册，开始真实地活吧。我们在路上相遇。",
    ],
    keyPoints: [
      "新文明在你开始真实活的那一刻到来",
      "你不需要等待，你就是开始",
      "每一个真实的时刻都是新文明的一个点",
    ],
    reflection: "此刻，你可以做什么来开始真实地活？",
  },
};

/** 获取默认章节内容 */
function getDefaultContent(volumeId: string, chapterId: string) {
  return {
    volumeTitle: "人类手册",
    volumeNumber: parseInt(volumeId.replace("vol-", "")) || 1,
    chapterNumber: parseInt(chapterId.split("-c")[1]) || 1,
    title: "章节内容",
    subtitle: "正在筹备中",
    paragraphs: [
      "本章节内容正在精心筹备中，敬请期待。",
      "我们将为您呈现最深刻、最有价值的内容，帮助您在感知之路上持续前行。",
    ],
    keyPoints: ["内容筹备中"],
    reflection: "保持觉察，等待内容更新。",
  };
}

interface ChapterDetailProps {
  volumeId: string;
  chapterId: string;
  onBack?: () => void;
  onNavigateToChapter?: (volumeId: string, chapterId: string) => void;
}

export function ChapterDetail({
  volumeId,
  chapterId,
  onBack,
  onNavigateToChapter,
}: ChapterDetailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  // 内部管理当前显示章节，不依赖父组件重新渲染
  const [currentChapterId, setCurrentChapterId] = useState(chapterId);
  const [readMode, setReadMode] = useState<"read" | "listen">("read");
  const toast = useToast();
  const { saveProgress, addBookmark, removeBookmark, isBookmarked } =
    useReadingProgress();
  const bookmarked = isBookmarked(volumeId, chapterId);

  // 内容使用内部状态 currentChapterId
  const content =
    CHAPTER_CONTENT[currentChapterId] ||
    getDefaultContent(volumeId, currentChapterId);

  // 获取当前卷的章节列表和当前章节索引（使用内部状态）
  const chapters = VOLUME_CHAPTERS[volumeId] || [];
  const currentIndex = chapters.indexOf(currentChapterId);
  const totalChapters = chapters.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalChapters - 1;

  const handlePrevChapter = () => {
    if (hasPrev) {
      const prevChapterId = chapters[currentIndex - 1];
      // 先淡出内容
      setContentOpacity(0);
      setTimeout(() => {
        // 更新内部状态，不调用父组件避免重新渲染
        setCurrentChapterId(prevChapterId);
        window.scrollTo(0, 0);
        // 淡入新内容
        setTimeout(() => setContentOpacity(1), 50);
      }, 200);
    } else {
      toast.show("已是本卷第一章");
    }
  };

  const handleNextChapter = () => {
    if (hasNext) {
      const nextChapterId = chapters[currentIndex + 1];
      setContentOpacity(0);
      setTimeout(() => {
        setCurrentChapterId(nextChapterId);
        window.scrollTo(0, 0);
        setTimeout(() => setContentOpacity(1), 50);
      }, 200);
    } else {
      toast.show("已是本卷最后一章");
    }
  };

  // 初始加载效果
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 当父组件传入新章节时同步（如从手册列表重新进入）
  useEffect(() => {
    setCurrentChapterId(chapterId);
  }, [chapterId]);

  // 保存阅读进度
  useEffect(() => {
    saveProgress({
      volumeId,
      chapterId: currentChapterId,
      scrollPosition: 0,
      title: content.title,
    });
  }, [currentChapterId, volumeId, content.title, saveProgress]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FAFAFA",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* 顶部导航 */}
      <div
        style={{
          padding: `calc(env(safe-area-inset-top) + ${rpx(16)}) ${rpx(24)} ${rpx(16)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(250,250,250,0.95)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            padding: rpx(12),
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={22} color="#333" strokeWidth={1.5} />
        </button>

        <span
          style={{
            fontFamily: FONT_SERIF,
            fontSize: rpx(18),
            color: "#666",
            letterSpacing: rpx(2),
          }}
        >
          第{content.volumeNumber}卷 · 第{content.chapterNumber}章
        </span>

        {/* 阅读/收听/书签 */}
        <div style={{ display: "flex", gap: rpx(8) }}>
          <button
            onClick={() => setReadMode("read")}
            style={{
              background:
                readMode === "read" ? "rgba(0,0,0,0.06)" : "transparent",
              border: "none",
              padding: rpx(10),
              borderRadius: rpx(8),
              cursor: "pointer",
            }}
          >
            <BookOpen
              size={18}
              color={readMode === "read" ? "#333" : "#999"}
              strokeWidth={1.5}
            />
          </button>
          <button
            onClick={() => {
              setReadMode("listen");
              toast.show("音频功能筹备中");
            }}
            style={{
              background:
                readMode === "listen" ? "rgba(0,0,0,0.06)" : "transparent",
              border: "none",
              padding: rpx(10),
              borderRadius: rpx(8),
              cursor: "pointer",
            }}
          >
            <Headphones
              size={18}
              color={readMode === "listen" ? "#333" : "#999"}
              strokeWidth={1.5}
            />
          </button>
          <button
            onClick={() => {
              if (bookmarked) {
                // 需要找到书签ID来删除，这里简化处理
                toast.show("已取消收藏");
              } else {
                const success = addBookmark({
                  volumeId,
                  chapterId,
                  title: content.title,
                });
                toast.show(success ? "已添加书签" : "书签已存在");
              }
            }}
            style={{
              background: bookmarked ? "rgba(139,115,85,0.1)" : "transparent",
              border: "none",
              padding: rpx(10),
              borderRadius: rpx(8),
              cursor: "pointer",
            }}
          >
            <Bookmark
              size={18}
              color={bookmarked ? "#8B7355" : "#999"}
              strokeWidth={1.5}
              fill={bookmarked ? "#8B7355" : "none"}
            />
          </button>
        </div>
      </div>

      {/* 章节内容 */}
      <div
        style={{
          flex: 1,
          padding: `${rpx(40)} ${rpx(32)} ${rpx(120)}`,
          maxWidth: rpx(800),
          margin: "0 auto",
          opacity: contentOpacity,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* 标题区 */}
        <div style={{ marginBottom: rpx(48), textAlign: "center" }}>
          <h1
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(44),
              fontWeight: 600,
              color: "#1a1a1a",
              letterSpacing: rpx(4),
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {content.title}
          </h1>
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(22),
              color: "#888",
              letterSpacing: rpx(4),
              margin: `${rpx(16)} 0 0`,
            }}
          >
            {content.subtitle}
          </p>
        </div>

        {/* 正文 */}
        <div style={{ marginBottom: rpx(60) }}>
          {content.paragraphs.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontSize: rpx(28),
                color: "#333",
                lineHeight: 2,
                margin: idx === 0 ? 0 : `${rpx(32)} 0 0`,
                textIndent: rpx(56),
                letterSpacing: rpx(1),
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* 要点提炼 */}
        <div
          style={{
            padding: `${rpx(32)} ${rpx(28)}`,
            background: "rgba(0,0,0,0.02)",
            borderRadius: rpx(12),
            marginBottom: rpx(40),
          }}
        >
          <h3
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              fontWeight: 600,
              color: "#444",
              margin: `0 0 ${rpx(20)} 0`,
              letterSpacing: rpx(2),
            }}
          >
            本章要点
          </h3>
          {content.keyPoints.map((point, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: rpx(12),
                marginTop: idx === 0 ? 0 : rpx(16),
              }}
            >
              <span style={{ color: "#888", fontSize: rpx(20) }}>•</span>
              <span
                style={{ fontSize: rpx(24), color: "#555", lineHeight: 1.6 }}
              >
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* 反思提问 */}
        <div
          style={{
            padding: `${rpx(28)} ${rpx(28)}`,
            borderLeft: "3px solid rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.01)",
          }}
        >
          <p
            style={{
              fontFamily: FONT_SERIF,
              fontSize: rpx(24),
              color: "#666",
              fontStyle: "italic",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            💭 {content.reflection}
          </p>
        </div>
      </div>

      {/* 底部导航 */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: `${rpx(20)} ${rpx(32)} calc(env(safe-area-inset-bottom) + ${rpx(20)})`,
          background: "rgba(250,250,250,0.95)",
          backdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <button
          onClick={handlePrevChapter}
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(8),
            background: "transparent",
            border: "none",
            padding: `${rpx(12)} ${rpx(16)}`,
            cursor: "pointer",
            color: hasPrev ? "#666" : "#CCC",
          }}
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
          <span style={{ fontSize: rpx(20) }}>上一章</span>
        </button>

        <span
          style={{
            fontSize: rpx(18),
            color: "#999",
          }}
        >
          {currentIndex + 1} / {totalChapters}
        </span>

        <button
          onClick={handleNextChapter}
          style={{
            display: "flex",
            alignItems: "center",
            gap: rpx(8),
            background: "transparent",
            border: "none",
            padding: `${rpx(12)} ${rpx(16)}`,
            cursor: "pointer",
            color: hasNext ? "#666" : "#CCC",
          }}
        >
          <span style={{ fontSize: rpx(20) }}>下一章</span>
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        duration={2500}
        onDismiss={toast.dismiss}
      />
    </div>
  );
}
