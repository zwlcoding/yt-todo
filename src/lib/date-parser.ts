export interface ParseResult {
  title: string;
  dueDate: Date | null;
}

export function parseNaturalDate(input: string): ParseResult {
  const now = new Date();
  let dueDate: Date | null = null;
  let title = input;

  const patterns = [
    {
      regex: /明天\s*(上午|下午|晚上)?\s*(\d{1,2})?\s*点?/,
      handler: (match: RegExpMatchArray) => {
        const date = new Date(now);
        date.setDate(date.getDate() + 1);
        const hour = match[2] ? parseInt(match[2], 10) : 9;
        const isAfternoon = match[1] === "下午" || match[1] === "晚上";
        date.setHours(isAfternoon && hour < 12 ? hour + 12 : hour, 0, 0, 0);
        return date;
      },
    },
    {
      regex: /后天\s*(上午|下午|晚上)?\s*(\d{1,2})?\s*点?/,
      handler: (match: RegExpMatchArray) => {
        const date = new Date(now);
        date.setDate(date.getDate() + 2);
        const hour = match[2] ? parseInt(match[2], 10) : 9;
        const isAfternoon = match[1] === "下午" || match[1] === "晚上";
        date.setHours(isAfternoon && hour < 12 ? hour + 12 : hour, 0, 0, 0);
        return date;
      },
    },
    {
      regex: /今天\s*(上午|下午|晚上)?\s*(\d{1,2})?\s*点?/,
      handler: (match: RegExpMatchArray) => {
        const date = new Date(now);
        const hour = match[2] ? parseInt(match[2], 10) : 9;
        const isAfternoon = match[1] === "下午" || match[1] === "晚上";
        date.setHours(isAfternoon && hour < 12 ? hour + 12 : hour, 0, 0, 0);
        return date;
      },
    },
    {
      regex: /下周(一|二|三|四|五|六|日)/,
      handler: (match: RegExpMatchArray) => {
        const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
        const targetDay = weekdays.indexOf(match[1]);
        const date = new Date(now);
        const currentDay = date.getDay();
        const daysUntilNextWeek = 7 - currentDay + targetDay;
        date.setDate(date.getDate() + daysUntilNextWeek);
        date.setHours(9, 0, 0, 0);
        return date;
      },
    },
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern.regex);
    if (match) {
      dueDate = pattern.handler(match);
      title = title.replace(match[0], "").trim();
      break;
    }
  }

  return { title: title || input, dueDate };
}
