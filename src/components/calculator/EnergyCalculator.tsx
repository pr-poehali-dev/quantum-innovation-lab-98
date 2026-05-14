import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Icon from '@/components/ui/icon'

interface Appliance {
  id: string
  name: string
  power: string
  quantity: string
  hours: string
}

const defaultAppliance = (): Appliance => ({
  id: crypto.randomUUID(),
  name: '',
  power: '',
  quantity: '1',
  hours: '',
})

export default function EnergyCalculator({ isActive }: { isActive: boolean }) {
  const [appliances, setAppliances] = useState<Appliance[]>([defaultAppliance()])
  const [result, setResult] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateAppliance = (id: string, field: keyof Appliance, value: string) => {
    setAppliances(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
    setErrors(prev => { const n = { ...prev }; delete n[`${id}-${field}`]; return n })
  }

  const addAppliance = () => {
    setAppliances(prev => [...prev, defaultAppliance()])
  }

  const removeAppliance = (id: string) => {
    setAppliances(prev => prev.length > 1 ? prev.filter(a => a.id !== id) : prev)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    appliances.forEach(a => {
      const power = parseFloat(a.power)
      const hours = parseFloat(a.hours)
      const qty = parseFloat(a.quantity || '1')
      if (!a.power || isNaN(power) || power <= 0) newErrors[`${a.id}-power`] = 'Введите мощность > 0'
      if (!a.hours || isNaN(hours) || hours <= 0) newErrors[`${a.id}-hours`] = 'Введите время > 0'
      if (a.quantity && (isNaN(qty) || qty <= 0)) newErrors[`${a.id}-quantity`] = 'Кол-во > 0'
    })
    return newErrors
  }

  const calculate = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const daily = appliances.reduce((sum, a) => {
      const p = parseFloat(a.power)
      const h = parseFloat(a.hours)
      const q = parseFloat(a.quantity || '1')
      return sum + (p * h * q) / 1000
    }, 0)
    setResult(Math.round(daily * 30 * 100) / 100)
  }

  const reset = () => {
    setAppliances([defaultAppliance()])
    setResult(null)
    setErrors({})
  }

  return (
    <section className="relative h-screen w-full snap-start flex flex-col justify-center px-4 md:px-16 lg:px-24 overflow-y-auto py-8">
      <motion.div
        className="w-full max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
          Калькулятор<br />энергопотребления
        </h2>
        <p className="text-neutral-400 mb-6 text-base md:text-lg">
          Введите данные приборов и узнайте месячный расход электроэнергии
        </p>

        <div className="space-y-3 mb-4 max-h-[40vh] overflow-y-auto pr-1">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[2fr_1.2fr_0.8fr_1.2fr_auto] gap-2 text-xs text-neutral-500 uppercase tracking-wider px-1">
            <span>Прибор</span>
            <span>Мощность, Вт</span>
            <span>Кол-во</span>
            <span>Часов/день</span>
            <span></span>
          </div>

          {appliances.map((a, idx) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_1.2fr_0.8fr_1.2fr_auto] gap-2 items-start"
            >
              <div className="md:col-span-1">
                <Input
                  placeholder={`Прибор ${idx + 1}`}
                  value={a.name}
                  onChange={e => updateAppliance(a.id, 'name', e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-[#FF4D00]"
                />
              </div>
              <div className="md:hidden col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAppliance(a.id)}
                  className="text-neutral-500 hover:text-red-500 h-9 w-9"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Вт"
                  value={a.power}
                  min="0"
                  onChange={e => updateAppliance(a.id, 'power', e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-[#FF4D00] ${errors[`${a.id}-power`] ? 'border-red-500' : ''}`}
                />
                {errors[`${a.id}-power`] && <p className="text-red-500 text-xs mt-1">{errors[`${a.id}-power`]}</p>}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="1"
                  value={a.quantity}
                  min="1"
                  onChange={e => updateAppliance(a.id, 'quantity', e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-[#FF4D00] ${errors[`${a.id}-quantity`] ? 'border-red-500' : ''}`}
                />
                {errors[`${a.id}-quantity`] && <p className="text-red-500 text-xs mt-1">{errors[`${a.id}-quantity`]}</p>}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="ч"
                  value={a.hours}
                  min="0"
                  onChange={e => updateAppliance(a.id, 'hours', e.target.value)}
                  className={`bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-[#FF4D00] ${errors[`${a.id}-hours`] ? 'border-red-500' : ''}`}
                />
                {errors[`${a.id}-hours`] && <p className="text-red-500 text-xs mt-1">{errors[`${a.id}-hours`]}</p>}
              </div>

              <div className="hidden md:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAppliance(a.id)}
                  className="text-neutral-500 hover:text-red-500 h-9 w-9"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={addAppliance}
          className="text-[#FF4D00] hover:bg-[#FF4D00]/10 mb-6 pl-0 flex items-center gap-2"
        >
          <Icon name="Plus" size={18} />
          Добавить прибор
        </Button>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={calculate}
            size="lg"
            className="bg-[#FF4D00] hover:bg-[#FF4D00]/80 text-white font-semibold px-8"
          >
            <Icon name="Zap" size={18} />
            Рассчитать
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <Icon name="RotateCcw" size={18} />
            Сбросить
          </Button>
        </div>

        {result !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-[#FF4D00]/10 border border-[#FF4D00]/40 rounded-xl px-6 py-5"
          >
            <p className="text-neutral-400 text-sm mb-1">Месячное энергопотребление</p>
            <p className="text-4xl md:text-5xl font-bold text-[#FF4D00]">
              {result.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} кВт·ч
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
