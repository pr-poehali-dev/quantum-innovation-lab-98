import { Badge } from "@/components/ui/badge"

export const sections = [
  {
    id: 'hero',
    subtitle: <Badge variant="outline" className="text-white border-white">Бесплатный инструмент</Badge>,
    title: 'Считай. Экономь. Контролируй.',
    content: 'Узнайте, сколько электроэнергии потребляют ваши приборы каждый месяц.',
    showButton: true,
    buttonText: 'Начать расчёт',
    scrollToId: 'calculator',
  },
  {
    id: 'howto',
    title: 'Как это работает?',
    content: 'Добавьте бытовые приборы, укажите их мощность и время работы — калькулятор мгновенно посчитает месячный расход в кВт·ч.',
  },
  {
    id: 'calculator',
    isCalculator: true,
  },
  {
    id: 'formula',
    title: 'Формула расчёта',
    content: 'Мощность (Вт) × Часы работы × Количество ÷ 1000 = кВт·ч в день. Умножаем на 30 дней — получаем месячный расход. Просто и точно.',
  },
]
