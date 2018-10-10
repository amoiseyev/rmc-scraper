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
                const results = []
                const links = document.querySelectorAll('a.single-column-list-item')

                links.forEach((link) => {
                    const list = Array.apply([], link.children[0].children)
                    const personData = {}

                    list.forEach((item, index) => {
                        const line = item.innerText

                        switch (index) {
                        case 0:
                            const name = line.includes(',') ? line.split(',')[0].split(' ') : line.split(' ')
                            personData.id = link.href
                            personData.firstName = name[0]
                            personData.lastName = name[name.length - 1]
                            personData.age = line.includes(',') ? line.split(',')[1].trim() : '' // optional value
                            break
                        case 1:
                            const location = line.split(',')
                            personData.city = location[0]
                            personData.state = location[1].trim()
                            break
                        }
                    })

                    results.push(personData)
                })
                return results
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
