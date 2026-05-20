import AuthController from './AuthController'
import TaskController from './TaskController'

const Api = {
    AuthController: Object.assign(AuthController, AuthController),
    TaskController: Object.assign(TaskController, TaskController),
}

export default Api