import Nightmare from 'nightmare'
import { removeNode, calculateAge } from './utils'
import { getNightmareConfig } from './constants'

class MyLife {
    static run (queryData) {
        const nightmare = Nightmare(getNightmareConfig())

        nightmare
            .goto(queryData.sid)
            .type('input[name="searchFirstName"]', queryData.firstName)
            .type('input[name="searchLastName"]', queryData.lastName)
            .type('input[name="searchLocation"]', queryData.city)
            .click('.nameSearchSubmit')
            .wait('#searchAge')
            .type('#searchAge', calculateAge(new Date(queryData.birthday)))
            .evaluate(removeNode, '.text-capitalize') // to capture .text-capitalize via wait after page load
            .click('#identity-claim-form-multi .btn.btn-primary')
            .wait('.text-capitalize')
            .evaluate(() => {
                const list = document.querySelectorAll('.row.well-plain')
                const results = []

                list.forEach((item) => {
                    results.push(item.innerText)
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

export default MyLife
