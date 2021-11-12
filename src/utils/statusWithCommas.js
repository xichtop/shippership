const statusWithCommas = (status) => {
    if (status === 'Da tiep nhan') return 'Đã tiếp nhận đơn hàng'
    else if (status === 'Dang ve kho') return 'Chờ xác nhận nhập kho của nhân viên kho'
    else if (status === 'Da ve kho') return 'Đã nhập kho'
    else if (status === 'Dang roi kho') return 'Chờ xác nhận xuất kho của nhân viên kho'
    else if (status === 'Da roi kho') return 'Đã rời kho'
    else if (status === 'Da giao hang') return 'Đã giao hàng'
}

export default statusWithCommas