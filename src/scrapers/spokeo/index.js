import Nightmare from 'nightmare'
import { getNightmareConfig, alphabet } from '../constants';
// import getData from './helper';

class Spokeo {
    static getData = async (queryData, nightmare, results = []) => {
        const personDataResult = await nightmare
            .evaluate(() => {
                const links = document.querySelectorAll('a.single-column-list-item');
                const results = [];
                links.forEach((link) => {
                    const list = Array.prototype.slice.call(link.children[0].children);
                    const personData = {};
                    
                    list.forEach((item, index) => {
                        const line = item.innerText;
                        
                        switch (index) {
                            case 0:
                            const name = line.includes(',') ? line.split(',')[0].split(' ') : line.split(' ');
                            personData.id = link.href;
                            personData.firstName = name[0];
                            personData.lastName = name[name.length - 1];
                            personData.age = line.includes(',') ? line.split(',')[1].trim() : ''; // optional value
                            break;
                            case 1:
                            const location = line.split(',');
                            personData.city = location[0];
                            personData.state = location[1].trim();
                            break;
                        }
                    })
                    results.push(personData);
                })
                return results;
            })
        results.push(...personDataResult);
        
        const shouldContinue = await nightmare
            .evaluate(() => {
            const paginationList = document.getElementsByClassName('pagination_item arrow');
                   const list = Array.prototype.slice.call(paginationList);
                   const btnNext = list.filter(item => item.rel === 'next');
                    if (btnNext.length > 0) {
                       btnNext[0].click();
                       return true;
                    }
                    return false;
        })

        if (shouldContinue) {
            return Spokeo.getData(queryData, nightmare, results);
        } 
        return results;
    }

    static run = async (queryData) => {
        const nightmare = Nightmare(getNightmareConfig());

        await nightmare
        .goto(`${queryData.sid}/people/${alphabet[0]}`)
        .evaluate(() => {
            document.querySelectorAll('.directory-link a')[1].click();
        })
        .evaluate(() => {
            document.querySelectorAll('.directory-link a')[0].click();
        })
        .evaluate(() => {
            document.querySelectorAll('.directory-link a')[2].click();
        })

        const results = await Spokeo.getData(queryData, nightmare);

            nightmare.catch((error) => {
                console.error('Search failed:', error)
            })
    
            console.log('result: ', results[0])
            console.log('result: ', results[results.length-1])
    }
}

export default Spokeo;
