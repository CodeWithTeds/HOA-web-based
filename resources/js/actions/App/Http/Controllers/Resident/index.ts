import DashboardController from './DashboardController'
import BillingController from './BillingController'
import ChatController from './ChatController'
import FacilityController from './FacilityController'
import ComplaintController from './ComplaintController'
import AnnouncementController from './AnnouncementController'
import TransparencyController from './TransparencyController'

const Resident = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    BillingController: Object.assign(BillingController, BillingController),
    ChatController: Object.assign(ChatController, ChatController),
    FacilityController: Object.assign(FacilityController, FacilityController),
    ComplaintController: Object.assign(ComplaintController, ComplaintController),
    AnnouncementController: Object.assign(AnnouncementController, AnnouncementController),
    TransparencyController: Object.assign(TransparencyController, TransparencyController),
}

export default Resident