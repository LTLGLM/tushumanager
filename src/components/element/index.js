import {
    Button,
    Input,
    Form,
    FormItem,
    Message,
    Notification,
    MessageBox,
    Row,
    Col,
    Container,
    Header,
    Aside,
    Main,
    Table,
    TableColumn,
    Menu,
    MenuItem,
    Submenu,
    MenuItemGroup,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Breadcrumb,
    BreadcrumbItem,
    DatePicker,
    Card,
    Tag,
    Dialog,
    RadioGroup,
    Radio,
    Upload,
    Pagination,
    Switch,
    Select,
    Option,
    Popconfirm,
    Tree,
    Tooltip,
    InputNumber,
    Cascader,
    Tabs,
    TabPane
} from 'element-ui'

const coms = [
    Button,
    Input,
    Form,
    FormItem,
    Row,
    Col,
    Container,
    Header,
    Aside,
    Main,
    Table,
    TableColumn,
    Menu,
    MenuItem,
    Submenu,
    MenuItemGroup,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Breadcrumb,
    BreadcrumbItem,
    DatePicker,
    Card,
    Tag,
    Dialog,
    RadioGroup,
    Radio,
    Upload,
    Pagination,
    Switch,
    Select,
    Option,
    Popconfirm,
    Tree,
    Tooltip,
    InputNumber,
    Cascader,
    Tabs,
    TabPane
]

// 手动指定输入信息的组件
const messages = [
    Notification,
    Message,
    MessageBox
]

export default {
    install(Vue, options) {
        coms.forEach(com => {
            Vue.component(com.name, com)
        })
        messages.forEach(msg => {
            Vue.prototype[`$${msg.name.toLowerCase()}`] = msg
        })
    }
}