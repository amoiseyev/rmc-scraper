import http from 'http'
import https from 'https'
import fs from 'fs'

export const removeNode = (selector) => document.querySelector(selector).remove()

export const calculateAge = function (birthday) {
    // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime()
    const ageDate = new Date(ageDifMs) // miliseconds from epoch

    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export const downloadFile = function (url, dest) {
    const file = fs.createWriteStream(dest)
    const protocol = url.includes('https') ? https : http

    return new Promise((resolve, reject) => protocol.get(url, function (response) {
        response.pipe(file)
        file.on('finish', function () {
            file.close(resolve) // close() is async, call cb after close completes.
        })
    }).on('error', function (err) { // Handle errors
        fs.unlinkSync(dest) // Delete the file async. (But we don't check the result)
        reject(err.message)
    }))
}
