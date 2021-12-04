const statusWithCommas = (status) => {
    if (status === 'Da tiep nhan') return 'Đã tiếp nhận đơn hàng'
    else if (status === 'Dang ve kho') return 'Đang nhập kho'
    else if (status === 'Da ve kho') return 'Đã nhập kho'
    else if (status === 'Dang roi kho') return 'Đang rời kho'
    else if (status === 'Da roi kho') return 'Đã rời kho'
    else if (status === 'Da giao hang') return 'Đã giao hàng'
    else if (status === 'Dang tra hang') return 'Đang trả hàng'
    else if (status === 'Da tra hang') return 'Đã trả hàng'
}

export default statusWithCommas