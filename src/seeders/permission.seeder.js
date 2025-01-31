import {Permission} from "@/app/models/permission";
import {PermissionGroup} from "@/app/models/permission-group";
import {PermissionType} from "@/app/models/permission-type";

const permission_types = {
    list: {
        name: "Truy cập",
        code: "list",
        position: 1,
    },
    detail: {
        name: "Xem chi tiết",
        code: "detail",
        position: 2,
    },
    add: {
        name: "Tạo mới",
        code: "add",
        position: 3,
    },
    edit: {
        name: "Chỉnh sửa",
        code: "edit",
        position: 4,
    },
    remove: {
        name: "Xóa",
        code: "delete",
        position: 5,
    },
};

const {list, add, edit, remove, detail} = permission_types;

const permission_groups = [
    {
        name: "Tổng quan",
        code: "admin-management",
        description: "",
        actor: "admin",
        children: [],
        types: {
            [list.code]: {
                name: "Xem tổng quan",
                description: "Xem thống kê tổng quan",
            },
        },
    },
    {
        name: "Quản lý khóa tập",
        code: "course-management",
        description: "",
        actor: "course",
        types: {
            [list.code]: {
                name: "Xem danh sách khóa tập",
                description: "Xem danh sách khóa tập",
            },
            [detail.code]: {
                name: "Xem chi tiết khóa tập",
                description: "Xem chi tiết khóa tập",
            },
            [add.code]: {
                name: "Thêm mới khóa tập",
                description: "Thêm mới khóa tập",
            },
            [edit.code]: {
                name: "Chỉnh sửa khóa tập",
                description: "Chỉnh sửa khóa tập",
            },
            [remove.code]: {
                name: "Xóa khóa tập",
                description: "Xóa khóa tập",
            },
        },
        children: [
            {
                name: "Khóa tập phổ biến",
                code: "popular-course",
                description: "Lựa chọn khóa phổ biến",
                children: [],
                actor: "popular-course",
                types: {
                    [edit.code]: {
                        name: "Khóa tập phổ biến",
                        description: "Lựa chọn khóa phổ biến",
                    },
                },
            },
        ],
    },
    {
        name: "Quản lý lớp thể thao",
        code: "class-management",
        description: "",
        actor: "class",
        types: {
            [list.code]: {
                name: "Xem danh sách lớp thể thao",
                description: "Xem danh sách lớp thể thao",
            },
            [add.code]: {
                name: "Thêm mới lớp thể thao",
                description: "Thêm mới lớp thể thao",
            },
            [edit.code]: {
                name: "Chỉnh sửa lớp thể thao",
                description: "Chỉnh sửa lớp thể thao",
            },
            [remove.code]: {
                name: "Xóa lớp thể thao",
                description: "Xóa lớp thể thao",
            },
        }
    },
    {
        name: "Đơn mua",
        code: "order-management",
        description: "Xử lý đơn mua",
        actor: "order",
        types: {
            [list.code]: {
                name: "Xem danh sách đơn mua",
                description: "Xem danh sách nhóm người dùng",
            },
        },
        children: [
            {
                name: "Xác nhận yêu cầu đơn mua",
                code: "confirm-point-deposit",
                description: "Quyền xác nhận giao dịch đơn mua",
                children: [],
                actor: "confirm",
                types: {
                    [edit.code]: {
                        name: "Xác nhận đơn mua",
                        description: "Quyền xác nhận yêu cầu giao dịch đơn mua",
                    },
                },
            },
            {
                name: "Hủy yêu cầu đơn mua",
                code: "cancel-point-deposit",
                description: "Quyền hủy giao dịch đơn mua",
                children: [],
                actor: "cancel",
                types: {
                    [edit.code]: {
                        name: "Hủy yêu cầu đơn mua",
                        description: "Quyền hủy yêu cầu giao dịch đơn mua",
                    },
                },
            },
            {
                name: "Xóa yêu cầu đơn mua",
                code: "delete-point-deposit",
                description: "Quyền xóa giao dịch đơn mua",
                children: [],
                actor: "delete",
                types: {
                    [remove.code]: {
                        name: "Xóa yêu cầu đơn mua",
                        description: "Quyền xóa yêu cầu giao dịch đơn mua",
                    },
                },
            },
        ],
    },
    {
        name: "Quản lý hội viên",
        code: "student-management",
        description: "",
        actor: "student",
        types: {
            [list.code]: {
                name: "Xem danh sách hội viên",
                description: "Xem danh sách hội viên",
            },
            [add.code]: {
                name: "Thêm mới hội viên",
                description: "Thêm mới hội viên",
            },
            [edit.code]: {
                name: "Chỉnh sửa thông tin hội viên",
                description: "Chỉnh sửa thông tin hội viên",
            },
            [remove.code]: {
                name: "Xóa hội viên",
                description: "Xóa hội viên",
            },
        },
        children: [
            {
                name: "Đổi mật khẩu hội viên",
                code: "reset-password-student",
                description: "Thay đổi mật khẩu hội viên",
                children: [],
                actor: "reset-password-student",
                types: {
                    [edit.code]: {
                        name: "Đổi mật khẩu hội viên",
                        description: "Thay đổi mật khẩu hội viên",
                    },
                },
            },
        ],
    },
    {
        name: "Quản lý huấn luyện viên",
        code: "teacher-management",
        description: "",
        actor: "teacher",
        types: {
            [list.code]: {
                name: "Xem danh sách huấn luyện viên",
                description: "Xem danh sách huấn luyện viên",
            },
            [add.code]: {
                name: "Thêm mới huấn luyện viên",
                description: "Thêm mới huấn luyện viên",
            },
            [edit.code]: {
                name: "Chỉnh sửa thông tin huấn luyện viên",
                description: "Chỉnh sửa thông tin huấn luyện viên",
            },
            [remove.code]: {
                name: "Xóa huấn luyện viên",
                description: "Xóa huấn luyện viên",
            },
        },
        children: [
            {
                name: "Đổi mật khẩu huấn luyện viên",
                code: "reset-password-teacher",
                description: "Thay đổi mật khẩu huấn luyện viên",
                children: [],
                actor: "reset-password-teacher",
                types: {
                    [edit.code]: {
                        name: "Đổi mật khẩu huấn luyện viên",
                        description: "Thay đổi mật khẩu huấn luyện viên",
                    },
                },
            },
        ],
    },
    {
        name: "Quản lý quản trị viên",
        code: "employee-management",
        description: "",
        actor: "employee",
        types: {
            [list.code]: {
                name: "Xem danh sách quản trị viên",
                description: "Xem danh sách quản trị viên",
            },
            [add.code]: {
                name: "Thêm mới quản trị viên",
                description: "Thêm mới quản trị viên",
            },
            [edit.code]: {
                name: "Chỉnh sửa thông tin quản trị viên",
                description: "Chỉnh sửa thông tin quản trị viên",
            },
            [remove.code]: {
                name: "Xóa quản trị viên",
                description: "Xóa quản trị viên",
            },
        },
        children: [
            {
                name: "Đổi mật khẩu quản trị viên",
                code: "reset-password-employee",
                description: "Thay đổi mật khẩu quản trị viên",
                children: [],
                actor: "reset-password-employee",
                types: {
                    [edit.code]: {
                        name: "Đổi mật khẩu quản trị viên",
                        description: "Thay đổi mật khẩu quản trị viên",
                    },
                },
            },
        ],
    },
    {
        name: "Quản lý vai trò",
        code: "role-management",
        actor: "role",
        description: "",
        types: {
            [list.code]: {
                name: "Xem danh sách vai trò người dùng",
                description: "Xem danh sách vai trò người dùng",
            },
            [add.code]: {
                name: "Thêm mới vai trò người dùng",
                description: "Thêm mới vai trò người dùng",
            },
            [edit.code]: {
                name: "Chỉnh sửa vai trò người dùng",
                description: "Chỉnh sửa vai trò người dùng",
            },
            [remove.code]: {
                name: "Xóa vai trò người dùng",
                description: "Xóa vai trò người dùng",
            },
        },
        children: [
            {
                name: "Quản lý quyền hạn",
                code: "permission-management",
                description: "",
                children: [],
                actor: "permission",
                types: {
                    [list.code]: {
                        name: "Xem danh sách quyền hạn của vai trò người dùng",
                        description: "Xem danh sách quyền hạn của vai trò người dùng",
                    },
                    [edit.code]: {
                        name: "Chỉnh sửa quyền hạn của vai trò người dùng",
                        description: "Chỉnh sửa quyền hạn của vai trò người dùng",
                    },
                },
            },
            {
                name: "Nhân viên với vai trò",
                code: "employee-with-role",
                description: "",
                children: [],
                actor: "employee-role",
                types: {
                    [edit.code]: {
                        name: "Cập nhật vai trò quản trị viên",
                        description: "Cập nhật quản trị viên với vai trò",
                    },
                    [remove.code]: {
                        name: "Xóa vai trò quản trị viên",
                        description: "Xóa quản trị viên với vai trò",
                    },
                },
            },
        ],
    },
    {
        name: "Cấu hình",
        code: "config-management",
        description: "",
        actor: "config",
        types: {
            [list.code]: {
                name: "Xem cấu hình",
                description: "Xem các cấu hình",
            },
        },
        children: [
            {
                name: "Cấu hình tài khoản ngân hàng",
                code: "config-bank-management",
                description: "",
                actor: "config-bank",
                types: {
                    [list.code]: {
                        name: "Xem cấu hình tài khoản ngân hàng",
                        description: "Xem cấu hình tài khoản ngân hàng",
                    },
                    [edit.code]: {
                        name: "Chỉnh sửa cấu hình tài khoản ngân hàng",
                        description: "Chỉnh sửa cấu hình tài khoản ngân hàng",
                    },
                },
            },
            {
                name: "Cấu hình liên hệ",
                code: "config-contact-management",
                description: "",
                actor: "config-contact",
                types: {
                    [list.code]: {
                        name: "Xem cấu hình liên hệ",
                        description: "Xem cấu hình liên hệ",
                    },
                    [edit.code]: {
                        name: "Chỉnh sửa cấu hình liên hệ",
                        description: "Chỉnh sửa cấu hình liên hệ",
                    },
                },
            },
            {
                name: "Cấu hình nhận xét",
                code: "config-feedback-management",
                description: "",
                actor: "config-feedback",
                types: {
                    [list.code]: {
                        name: "Xem danh sách nhận xét",
                        description: "Xem danh sách nhận xét",
                    },
                    [add.code]: {
                        name: "Thêm mới nhận xét",
                        description: "Thêm mới nhận xét",
                    },
                    [edit.code]: {
                        name: "Chỉnh sửa nhận xét",
                        description: "Chỉnh sửa nhận xét",
                    },
                    [remove.code]: {
                        name: "Xóa nhận xét",
                        description: "Xóa nhận xét",
                    },
                },
            },
        ],
    }
];

async function handlePermissionAndPermissionGroup(data, parent_code = null) {
    for (const permission_group of data) {
        await PermissionGroup.findOneAndUpdate(
            {code: permission_group.code},
            {
                $set: {
                    code: permission_group.code,
                    name: permission_group.name,
                    description: permission_group.description,
                    parent_code: parent_code,
                },
            },
            {upsert: true, new: true},
        );
        for (const type_key of Object.keys(permission_group.types)) {
            await Permission.findOneAndUpdate(
                {code: `${type_key}-${permission_group.actor}`},
                {
                    $set: {
                        code: `${type_key}-${permission_group.actor}`,
                        name: permission_group.types[type_key].name,
                        description: permission_group.types[type_key].description,
                        permission_group_code: permission_group.code,
                        permission_type_code: type_key,
                    },
                },
                {upsert: true, new: true},
            );
        }
        if (permission_group.children?.length > 0) {
            await handlePermissionAndPermissionGroup(permission_group.children, permission_group.code);
        }
    }
}

export default async function () {
    try {
        // Quyền Quản trị cấp cao
        const super_admin_permission = {
            code: "super_admin",
            permission_group_code: null,
            permission_type_code: null,
            description: "Có toàn quyền sử dụng hệ thống",
        };
        await Permission.findOneAndUpdate(
            {code: super_admin_permission.code},
            {$set: {...super_admin_permission}},
            {upsert: true, new: true},
        );

        // Permission Types
        for (const key of Object.keys(permission_types)) {
            await PermissionType.findOneAndUpdate(
                {code: permission_types[key].code},
                {
                    $set: {
                        name: permission_types[key].name,
                        code: permission_types[key].code,
                        position: permission_types[key].position,
                    },
                },
                {upsert: true, new: true},
            );
        }

        // Permission Groups
        await handlePermissionAndPermissionGroup(permission_groups);
    } catch (error) {
        console.error(error);
    }
}
