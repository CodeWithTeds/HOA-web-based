import Api from './Api'
import Resident from './Resident'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    Api: Object.assign(Api, Api),
    Resident: Object.assign(Resident, Resident),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers