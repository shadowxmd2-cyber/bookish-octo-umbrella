import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CloudSun, LogIn, UserPlus, Send } from 'lucide-react'

export default function WeatherCheckApp() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [user, setUser] = useState(null)
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })

  const API_KEY = 'a893ab9c6efabc870d271e0f2c19016b'
  const TELEGRAM_BOT_TOKEN = '8266023841:AAF7WQf-CngjP6KVcBJS7AeJ8WdcSYxlA5I'
  const TELEGRAM_CHAT_ID = '1720283336'

  const getWeather = async () => {
    if (!city) return
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    const data = await res.json()
    setWeather(data)
  }

  const handleAuth = () => {
    if (!form.username || !form.password) return alert('Fill all fields')
    localStorage.setItem('user', JSON.stringify(form))
    setUser(form)
  }

  const handleTelegram = async (msg) => {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg })
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600 text-white p-6">
      <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-6 flex items-center gap-2">
        <CloudSun size={36} /> Weather Check Portal
      </motion.h1>

      {!user ? (
        <Card className="bg-white/20 text-white p-6 w-full max-w-md rounded-2xl shadow-lg">
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold mb-2">{isRegister ? 'Register' : 'Login'}</h2>
            <Input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button onClick={handleAuth} className="mt-2">{isRegister ? <UserPlus /> : <LogIn />} {isRegister ? 'Register' : 'Login'}</Button>
            <p className="text-sm mt-2 text-center cursor-pointer underline" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account? Login' : 'New user? Register'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full max-w-lg">
          <div className="flex gap-2 mb-4">
            <Input placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} className="text-black" />
            <Button onClick={() => { getWeather(); handleTelegram(`User ${user.username} checked weather for ${city}`) }}>Check</Button>
          </div>
          {weather && weather.main ? (
            <Card className="bg-white/20 text-white p-6 w-full rounded-2xl shadow-xl">
              <CardContent className="text-center">
                <h2 className="text-3xl font-semibold mb-2">{weather.name}</h2>
                <p className="text-xl">{weather.weather[0].description}</p>
                <p className="text-5xl font-bold my-3">{weather.main.temp}°C</p>
                <p>Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s</p>
              </CardContent>
            </Card>
          ) : null}

          <Button variant="secondary" className="mt-6" onClick={() => { localStorage.removeItem('user'); setUser(null) }}>Logout</Button>

          <p className="mt-6 text-sm opacity-70">Developed by <b>Kavindu Iduwara</b> & Team 🌍</p>
        </motion.div>
      )}
    </div>
  )
}
