import { MeditationSession, MeditationStats } from '../types/models'
import { getMeditationSessions, saveStats } from './storage'

export const computeStats = (): MeditationStats => {
  const sessions = getMeditationSessions()

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageDuration: 0,
      longestStreak: 0,
      lastMeditationDate: ''
    }
  }

  const totalSessions = sessions.length
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
  const averageDuration = Math.round(totalDuration / totalSessions)

  const lastMeditationDate = sessions[sessions.length - 1].date

  const streaks = computeLongestStreak(sessions)

  const stats = {
    totalSessions,
    totalDuration,
    averageDuration,
    longestStreak: streaks,
    lastMeditationDate
  }

  saveStats(stats)
  return stats
}
