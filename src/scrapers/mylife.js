import fs from 'fs'
import xmlParse from 'xml-parser'
import { ungzip } from 'node-gzip'
import Nightmare from 'nightmare'

import { downloadFile } from './utils'
import { getNightmareConfig, appPath } from './constants'

const sitemapXmlFile = 'people_sitemapindex1.xml'
const gzTmpFilePath = `${appPath}/tmp/data.xml.gz`
const xmlFilePath = `${appPath}/tmp/${sitemapXmlFile}`

class MyLife {
    static getSiteMapChunks (sid) {
        return downloadFile(`${sid}/${sitemapXmlFile}`, xmlFilePath).then(() => {
            const xml = fs.readFileSync(xmlFilePath, 'utf8')
            return xmlParse(xml)
        }).then((result) => {
            fs.unlinkSync(xmlFilePath)

            const siteMapChunks = result.root.children

            return siteMapChunks.map((siteMapChunk) => {
                const siteMapChunkLink = siteMapChunk.children[0].content
                return siteMapChunkLink
            })
        })
    }

    static getDataEntryPoints = async (sid) => {
        const chunksLinks = await MyLife.getSiteMapChunks(sid)

        return downloadFile(chunksLinks[0], gzTmpFilePath).then(() => {
            const compressed = fs.readFileSync(gzTmpFilePath)

            return ungzip(compressed).then((decompressed) => {
                return xmlParse(decompressed.toString())
            })
        }).then((result) => {
            fs.unlinkSync(gzTmpFilePath)

            const peopleLinks = result.root.children

            return peopleLinks.map((link) => {
                return link.children[0].content
            })
        })
    }

    static scrapPersonData = async (nightmare, dataLinks, results = []) => {
        const link = dataLinks.shift()
        console.log(link)

        const personData = await nightmare
            .goto(link)
            .evaluate((link) => {
                const nameAgeLine = document.querySelector('.profile-information-name-age').innerText
                const name = nameAgeLine.split(',')[0].split(' ')
                const location = document.querySelector('.profile-information-location').innerText.split(',')
                const personData = {}

                personData.id = link
                personData.firstName = name[0]
                personData.lastName = name[name.length - 1]
                personData.age = nameAgeLine.includes(',') ? nameAgeLine.split(',')[1].trim() : '' // optional value
                personData.city = location[0]
                personData.state = location[1].trim()

                return personData
            }, link)

        results.push(personData)

        if (dataLinks.length) {
            return MyLife.scrapPersonData(nightmare, dataLinks, results)
        } else {
            return results
        }
    }

    static run = async (queryData) => {
        const dataLinks = await MyLife.getDataEntryPoints(queryData.sid)

        const nightmare = Nightmare(getNightmareConfig())

        const results = await MyLife.scrapPersonData(nightmare, dataLinks)

        nightmare.catch((error) => {
            console.error('Search failed:', error)
        })

        console.log('result: ', results)
    }
}

export default MyLife
