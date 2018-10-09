import { SID_MAP } from '../scrapers/sidMap'

const appRouter = function (app) {
    /**
     * POST /query body params:
     * sid:https://www.mylife.com/
     * firstName:John
     * lastName:Smith
     * alias:Johnny
     * sex:Male
     * birthday:01.01.1968
     * email:some@gmail.com
     * phone:6265555555
     * street:411 Brighton St
     * city:West Islip
     * state:NY
     * zip:95945
     * relatives:[{"firstName":"Joseph","lastName":"Smith"},{"firstName":"Sailume","lastName":"Smith"}]
     */

    app.post('/query', function ({ body }, res) {
        const { sid } = body
        const scraper = SID_MAP[sid]

        if (scraper) {
            scraper(body)
                .then((results) => res.status(201).send(results))
                .catch(() => res.status(500).end())
        } else {
            res.status(404).end()
        }
    })
}

export default appRouter
