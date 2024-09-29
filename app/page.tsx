"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { CheckCircle2, SunIcon, Moon, Sun } from "lucide-react"

interface SummaryData {
  consumption: string;
  period: string;
  panelPower: string;
  peakSunHours: string;
  result: number;
}

export default function CalculadoraPanelesSolares() {
  const [consumption, setConsumption] = useState("")
  const [period, setPeriod] = useState("bimestral")
  const [panelPower, setPanelPower] = useState("")
  const [peakSunHours, setPeakSunHours] = useState("")
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {}
    if (!consumption || isNaN(Number(consumption)) || Number(consumption) <= 0) {
      newErrors.consumption = "Por favor, ingrese un valor de consumo válido"
    }
    if (!panelPower || isNaN(Number(panelPower)) || Number(panelPower) <= 0) {
      newErrors.panelPower = "Por favor, ingrese una potencia de panel válida"
    }
    if (!peakSunHours || isNaN(Number(peakSunHours)) || Number(peakSunHours) <= 0 || Number(peakSunHours) > 24) {
      newErrors.peakSunHours = "Por favor, ingrese un número válido de horas pico de sol (0-24)"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculatePanels = () => {
    if (!validateInputs()) return

    const monthlyConsumption = period === "bimestral" ? Number(consumption) / 2 : Number(consumption)
    const dailyConsumption = monthlyConsumption / 30
    const dailyEnergyRequired = dailyConsumption / Number(peakSunHours)
    const numberOfPanels = Math.ceil(dailyEnergyRequired * 1000 / Number(panelPower))
    
    setSummary({
      consumption,
      period,
      panelPower,
      peakSunHours,
      result: numberOfPanels
    })
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="data-[state=checked]:bg-slate-700"
          />
          <Moon className="h-4 w-4 text-slate-300" />
        </div>
      </div>
      <Card className="bg-white dark:bg-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600 dark:text-blue-300">
            <SunIcon className="inline-block mr-2" />
            Calculadora de Paneles Solares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="consumption" className="text-lg font-semibold">Consumo (kWh)</Label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  id="consumption"
                  type="number"
                  placeholder="Ingrese el consumo"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  className={`flex-grow ${errors.consumption ? 'border-red-500' : ''}`}
                />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Seleccione período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="bimestral">Bimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.consumption && <p className="text-red-500 text-sm">{errors.consumption}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="panelPower" className="text-lg font-semibold">Potencia del Panel (W)</Label>
              <Input
                id="panelPower"
                type="number"
                placeholder="Ingrese la potencia del panel"
                value={panelPower}
                onChange={(e) => setPanelPower(e.target.value)}
                className={errors.panelPower ? 'border-red-500' : ''}
              />
              {errors.panelPower && <p className="text-red-500 text-sm">{errors.panelPower}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="peakSunHours" className="text-lg font-semibold">Horas Pico de Sol</Label>
              <Input
                id="peakSunHours"
                type="number"
                step="0.1"
                placeholder="Ingrese las horas pico de sol"
                value={peakSunHours}
                onChange={(e) => setPeakSunHours(e.target.value)}
                className={errors.peakSunHours ? 'border-red-500' : ''}
              />
              {errors.peakSunHours && <p className="text-red-500 text-sm">{errors.peakSunHours}</p>}
            </div>
            <Button 
              type="button" 
              onClick={calculatePanels} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Calcular
            </Button>
          </form>
        </CardContent>
      </Card>

      {summary && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="inline-block mr-2" />
              Resumen de cálculo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg"><strong>Paneles requeridos:</strong> <span className="text-blue-600 dark:text-blue-400">{summary.result}</span></p>
              <p><strong>Consumo:</strong> {summary.consumption} kWh ({summary.period})</p>
              <p><strong>Potencia del panel:</strong> {summary.panelPower} W</p>
              <p><strong>Horas pico de sol:</strong> {summary.peakSunHours}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}