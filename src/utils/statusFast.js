const statusFast = (status) => {
    if (status === 'Ordered') return 'Đã tiếp nhận'
    else if (status === 'Delivering') return 'Đang giao hàng'
    else if (status === 'Delivered') return 'Đã giao hàng'
    else if (status === 'Canceled') return 'Đã hủy'
    else if (status === 'Returning') return 'Đang trả hàng'
    else if (status === 'Returned') return 'Đã trả hàng'
}

export default statusFast