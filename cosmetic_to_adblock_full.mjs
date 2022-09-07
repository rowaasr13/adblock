import JSONC from 'jsonc-simple-parser'
import { readFileSync } from 'fs'

let sites
try {
  const text = readFileSync('cosmetic.json', 'utf8')
  sites = JSONC.parse(text)
} catch (err) {
  console.error(err)
}

const out = process.stdout

let uniq = {}

for (let idx = 0; idx < sites.length; idx += 2) {
    const site_list = sites[idx]
    const selector_list = sites[idx + 1]
    // console.log(site_list, selector_list)
    for (let selector_idx = 0; selector_idx < selector_list.length; selector_idx++) {
        for (let site_idx = 0; site_idx < site_list.length; site_idx++) {
            const site = site_list[site_idx]
            const selector = selector_list[selector_idx]

            let uniq_key = `${site}\0${selector}`
            if (uniq[uniq_key]) {
                console.error(`duplicate ${site} ${selector}`)
                continue
            }
            uniq[uniq_key] = 1

            out.write(`${site}##${selector}\n`)
            out.write(`${site}##${selector}:remove()\n`)
            out.write(`${site}##^${selector}\n`)
        }
    }
}
