import axios from 'axios'
import { getCache, setCache } from '@/utils/cache'

const serverConfig = async function () {
  let cacheServerConfig = getCache('server.config')
  if (cacheServerConfig) {
    return cacheServerConfig
  }

  let serverConfigUrl = window.localStorage.getItem('server.config.url')
  if (!serverConfigUrl) {
    serverConfigUrl = '/server.config.json'
    window.localStorage.setItem('server.config.url', serverConfigUrl)
  }

  let serverConfigEnv = window.localStorage.getItem('server.config.env')
  if (!serverConfigEnv) {
    serverConfigEnv = import.meta.env.MODE
    window.localStorage.setItem('server.config.env', serverConfigEnv)
  }

  await axios
    .get(serverConfigUrl)
    .then((e) => {
      if (!e.data[serverConfigEnv]) {
        throw new Error('Server config env not exists.')
      }

      cacheServerConfig = e.data[serverConfigEnv]
      setCache('server.config', cacheServerConfig, 3600 * 24 * 30)
    })
    .catch(() => {
      throw new Error('无法加载服务配置，可能网络遇到了错误.')
    })

  return cacheServerConfig
}

export default serverConfig
