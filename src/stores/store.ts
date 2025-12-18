import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { Player, Power, Generator, SessionInfo, Sink, ProdStat, SocketAnswer } from '../types'

export const useStore = defineStore('store', () => {
  // Refs
  let socket: WebSocket | null = null

  const players = ref<Player[]>([])
  const power = ref<Power[]>([])
  const generators = ref<Generator[]>([])
  const sessionInfo = ref<SessionInfo>()
  const resourceSink = ref<Sink>()
  const explorationSink = ref<Sink>()
  const prodStats = ref<ProdStat[]>([])

  const hostname = ref<string>(import.meta.env.DEV ? 'localhost:5173' : `${location.hostname}:8080`)
  // Computed
  const onlinePlayers = computed(() => players.value.filter((p) => p.Online))
  console.log()

  // Methods
  const connectToSocket = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      socket = new WebSocket('ws://192.168.0.13:8080')
      socket.onopen = function (e) {
        console.log('socket connected')
        resolve(true)
      }
      socket.onerror = function (e) {
        reject(false)
      }
      socket.onmessage = parseSocketMessage
    })
  }

  const parseSocketMessage = (e: MessageEvent): void => {
    const data: SocketAnswer = JSON.parse(e.data)
    switch (data.endpoint) {
      case 'getPlayer':
        players.value = data.data
        break
      case 'getPower':
        power.value = data.data
        break
      case 'getGenerators':
        generators.value = data.data
        break
      case 'getResourceSink':
        resourceSink.value = data.data[0]
        break
      case 'getExplorationSink':
        explorationSink.value = data.data[0]
        break
      case 'getProdStats':
        prodStats.value = data.data
        break
      default:
        if (data.SessionName) sessionInfo.value = data
    }
  }

  const subscribeAll = () => {
    socket?.send(
      JSON.stringify({
        action: 'subscribe',
        endpoints: ['getPlayer', 'getPower', 'getGenerators', 'getSessionInfo', 'getResourceSink', 'getExplorationSink', 'getProdStats'],
      })
    )
  }
  // const subscribePlayers = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getPlayer',
  //     })
  //   )
  // }
  // const subscribePower = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getPower',
  //     })
  //   )
  // }
  // const subscribeGenerators = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getGenerators',
  //     })
  //   )
  // }
  // const subscribeSessionInfo = () => {
  //   socket?.send(
  //     JSON.stringify({
  //       action: 'subscribe',
  //       endpoints: 'getSessionInfo',
  //     })
  //   )
  // }

  const getColor = (percent: number): string => {
    if (percent >= 85) return '#13ce66'
    else if (percent >= 50) return '#20a0ff'
    else if (percent >= 25) return '#e6a23c'
    else return '#ff4949'
  }

  return {
    players,
    power,
    generators,
    onlinePlayers,
    sessionInfo,
    resourceSink,
    explorationSink,
    prodStats,
    connectToSocket,
    subscribeAll,
    // subscribePlayers,
    // subscribePower,
    // subscribeGenerators,
    // subscribeSessionInfo,
    getColor,
    hostname,
  }
})
