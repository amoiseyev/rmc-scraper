import Nightmare from 'nightmare'
import { getNightmareConfig, alphabet } from './constants'

class Spokeo {
    static run (queryData) {
        const nightmare = Nightmare(getNightmareConfig())

        nightmare
            .goto(`${queryData.sid}/people/${alphabet[0]}`)
            .evaluate(() => {
                document.querySelectorAll('.directory-link a')[0].click()
            })
            .evaluate(() => {
                document.querySelectorAll('.directory-link a')[0].click()
            })
            .evaluate(() => {
                document.querySelectorAll('.directory-link a')[0].click()
            })
            .evaluate(() => {
                const links = document.querySelectorAll('a.single-column-list-item')
                return links
            })
            .end()
            .then((results) => {
                console.log('result: ', results)
                return results
            })
            .catch((error) => {
                console.error('Search failed:', error)
            })
    }
}

export default Spokeo
