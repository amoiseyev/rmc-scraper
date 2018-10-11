import { getDefaultSettings } from "http2";

const getData = () => {
    const results = [];
    const links = document.querySelectorAll('a.single-column-list-item');

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
                break
                case 1:
                const location = line.split(',');
                personData.city = location[0];
                personData.state = location[1].trim();
                break
            }
        })
        results.push(personData);
    })

    // const paginationList = document.getElementsByClassName('pagination_item arrow');
    // const paginationBtns = Array.prototype.slice.call(paginationList);
    // const btnNext = paginationBtns.filter(item => item.rel === 'next');

    // if (btnNext.length > 0) {
    //     debugger
    //     btnNext[0].click();
    //     getData();
    // };
    // return results;
}

export default getData;