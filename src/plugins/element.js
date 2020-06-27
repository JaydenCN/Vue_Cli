import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Message.name, Message)
Vue.use(MessageBox.name, MessageBox)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox.msgbox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
