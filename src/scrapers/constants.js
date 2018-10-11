export const isDebug = !!process.env.DEBUG

export const getNightmareConfig = () => {
    const config = {
        show: isDebug
    }
    if (isDebug) {
        config.openDevTools = true
        // increase the evaluate timeout to test things
        config.executionTimeout = 90000000
        config.waitTimeout = 90000000
    }
    return config
}

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const appPath = process.cwd()
