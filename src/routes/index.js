import { SID_MAP } from '../scrapers/sidMap'

const appRouter = function (app) {
    /**
     * POST /query body params:
     * sid - site url, for example https://www.spokeo.com
     */

    app.post('/query', function ({ body }, res) {
        const { sid } = body
        const Scraper = SID_MAP[sid]

        if (Scraper) {
            Scraper.run(body)
            res.status(201).end()
        } else {
            res.status(404).end()
        }
    })
}

export default appRouter
