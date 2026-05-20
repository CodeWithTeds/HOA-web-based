import billing from './billing'
import facilities from './facilities'
import complaints from './complaints'
import announcements from './announcements'
import documents from './documents'
import transparency from './transparency'

const resident = {
    billing: Object.assign(billing, billing),
    facilities: Object.assign(facilities, facilities),
    complaints: Object.assign(complaints, complaints),
    announcements: Object.assign(announcements, announcements),
    documents: Object.assign(documents, documents),
    transparency: Object.assign(transparency, transparency),
}

export default resident