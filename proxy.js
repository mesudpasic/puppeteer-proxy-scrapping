const puppeteer = require('puppeteer');
const PROXY_SITE="https://free-proxy-list.net/";

(async () => {
    /* to see what's going on set {headless: false} */
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();    
    await page.goto(PROXY_SITE);
    let proxyList =await page.evaluate(() => {                
        let list=[];
        let currPageIndex=0; /* starting point */
        let currPage=document.querySelector(".paginate_button.active a").innerText;
        try{        
            while (currPageIndex<currPage){
                /* we select all table rows from current paginated dataset and look for table data cells */
                document.querySelectorAll(".dataTable tr").forEach(row => {                    
                    let proxyItem={};                    
                    /* get all cell elements in array */
                    let td=row.getElementsByTagName("td");                      
                    /* make sure length>0 otherwise it could be that we are dealing with header or footer th elements */
                    if (td.length){
                        /* ip is first cell, 2nd is port number, and 6th cell is indicator if proxy supports HTTPS */          
                        proxyItem.ip=td[0].innerText;
                        proxyItem.port=td[1].innerText;
                        proxyItem.ssl=td[6].innerText==="no" ? false : true;                            
                        list.push(proxyItem);
                    }                    
                });
                currPageIndex++;
                /* simulate 'Next' click */
                document.querySelector(".paginate_button.next a").click();
                /* update current page number */
                currPage=document.querySelector(".paginate_button.active a").innerText
            }
        } catch (e){
            console.log(e);
        }
        /* we need to return the list from promise */
        return list;
    });
    console.log(`Results from scrapping proxy list from web site: ${PROXY_SITE}, total results count: ${proxyList.length}, results:\n ${JSON.stringify(proxyList)}`);    
    await browser.close();
  })();
