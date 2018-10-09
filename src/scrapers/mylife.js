const Nightmare = require('nightmare')

const removeNode = (selector) => document.querySelector(selector).remove()

function calculateAge (birthday) {
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime()
    var ageDate = new Date(ageDifMs) // miliseconds from epoch

    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const Mylife = (queryData) => {
    const nightmare = Nightmare({
        show: false,
        // debugging stuff:
        openDevTools: false,
        executionTimeout: 90000000 // increase the evaluate timeout to test things
    })

    return nightmare
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

export default Mylife
