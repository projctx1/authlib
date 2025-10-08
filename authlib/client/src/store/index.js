import { createStore } from 'vuex'
import auth from './modules/auth'
import validation from './modules/validation'
import otp from './modules/otp'
import ui from './modules/ui'

export default createStore({
  modules: {
    auth,
    validation,
    otp,
    ui
  }
})
