import DashboardController from './DashboardController'
import StaffController from './StaffController'
import ResidentController from './ResidentController'
import FacilityController from './FacilityController'
import AnnouncementController from './AnnouncementController'
import ComplaintController from './ComplaintController'
import BillingController from './BillingController'
import ReportController from './ReportController'
import BookingController from './BookingController'
import ChatController from './ChatController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    StaffController: Object.assign(StaffController, StaffController),
    ResidentController: Object.assign(ResidentController, ResidentController),
    FacilityController: Object.assign(FacilityController, FacilityController),
    AnnouncementController: Object.assign(AnnouncementController, AnnouncementController),
    ComplaintController: Object.assign(ComplaintController, ComplaintController),
    BillingController: Object.assign(BillingController, BillingController),
    ReportController: Object.assign(ReportController, ReportController),
    BookingController: Object.assign(BookingController, BookingController),
    ChatController: Object.assign(ChatController, ChatController),
}

export default Admin