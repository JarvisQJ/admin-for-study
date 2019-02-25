module.exports = {
  purchaseSelect: {
    filename: '购买力筛查表.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '用户账号', key: 'username', width: 16},
      {header: '消费金额', key: 'order_moneys', width: 10},
      {header: '消费次数', key: 'order_counts', width: 10},
      {header: '最近购买时间', key: 'order_date', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}}
    ]
  },
  userList: {
    filename: '用户列表.xlsx',
    columns: [
      {header: '用户ID', key: 'id', width: 10},
      {header: '用户账号', key: 'username', width: 16},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '注册日期', key: 'createdAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '启用状态', key: 'usertype', width: 15}
    ]
  },
  balanceFlow: {
    filename: '用户资金流水列表.xlsx',
    columns: [
      {header: '用户ID', key: 'id', width: 10},
      {header: '用户账号', key: 'username', width: 16},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '交易时间', key: 'createdAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '资金转入', key: 'money_in', width: 10},
      {header: '资金转出', key: 'money_out', width: 10},
      {header: '余额', key: 'current_balance', width: 10},
      {header: '交易类别', key: 'bill_type', width: 10},
      {header: '摘要', key: 'summary', width: 15}
    ]
  },
  goldFlow: {
    filename: '用户黄金流水列表.xlsx',
    columns: [
      {header: '用户ID', key: 'id', width: 10},
      {header: '用户账号', key: 'username', width: 16},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '交易时间', key: 'createdAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '交易类别', key: 'bill_type', width: 10},
      {header: '产品分类', key: 'product_type', width: 10},
      {header: '产品名称', key: 'p_product_name', width: 10},
      {header: '黄金转入', key: 'weight_in', width: 10},
      {header: '黄金转出', key: 'weight_out', width: 10},
      {header: '黄金资产', key: 'current_gold_weight', width: 10},
      {header: '摘要', key: 'summary', width: 15}
    ]
  },
  inviteStatistic: {
    filename: '用户邀请统计列表.xlsx',
    columns: [
      {header: '用户ID', key: 'id', width: 10},
      {header: '用户账号', key: 'username', width: 16},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '邀请好友数', key: 'success_invite', width: 10},
      {header: '成功交易好友数', key: 'success_deal', width: 15}
    ]
  },
  userRanking: {
    filename: '用户消费排行.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '用户账号', key: 'username', width: 16},
      {header: '总购买次数', key: 'order_counts', width: 10},
      {header: '总购买克数', key: 'order_weights', width: 10},
      {header: '总购买金额', key: 'order_moneys', width: 10}
    ]
  },
  saleStatistics: {
    filename: '销售统计.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '订单号', key: 'code', width: 20},
      {header: '商品名称', key: 'product_name', width: 10},
      {header: '重量(g)', key: 'weight', width: 10},
      {header: '订单金额', key: 'money', width: 10},
      {header: '订单状态', key: 'order_status', width: 10},
      {header: '下单时间', key: 'createdAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '完成时间', key: 'updatedAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}}
    ]
  },
  statisticsList: {
    filename: '统计列表.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '账号', key: 'username', width: 15},
      {header: '姓名', key: 'nickname', width: 10},
      {header: '是否VIP', key: 'is_vip', width: 10},
      {header: '累计充值', key: 'recharge', width: 10},
      {header: '余额买入', key: 'pay_balance', width: 10},
      {header: '在线买入', key: 'pay_online', width: 10},
      {header: '买入克数', key: 'pay_weight', width: 10},
      {header: '未来金定制中', key: 'wl_mading', width: 10},
      {header: '未来金已完成', key: 'wl_finished', width: 10},
      {header: '未来金已发货', key: 'wl_delivery', width: 10},
      {header: '存金克数', key: 'keep_weight', width: 10},
      {header: 'K支付转入', key: 'roll_in', width: 10},
      {header: 'K支付转出', key: 'roll_out', width: 10},
      {header: '商家K支付年费', key: 'year_fee', width: 10},
      {header: 'K支付排队费用', key: 'line_fee', width: 10},
      {header: '累计卖出', key: 'offtake_weight', width: 10},
      {header: '卖出金额', key: 'offtake_money', width: 10},
      {header: '累计提金', key: 'tijin_weight', width: 10},
      {header: '利息收入', key: 'interest', width: 10},
      {header: '送金', key: 'send_weight', width: 10},
      {header: '未来金转积分', key: 'wl_to_integral', width: 10},
      {header: '分销提成/奖励', key: 'award_money', width: 10},
      {header: '提现中金额', key: 'withdrawing', width: 10},
      {header: '累计手续费', key: 'offtake_fee', width: 10},
      {header: '累计提现', key: 'withdraw_cash', width: 10},
      {header: '账户余额', key: 'balance', width: 10},
      {header: '黄金资产', key: 'goldweight', width: 10},
      {header: '余额差', key: 'diff_balance', width: 10},
      {header: '黄金差', key: 'diff_goldweight', width: 10},
      {header: '提现中', key: 'is_withdrawing', width: 10},
      {header: '认证类型', key: 'certify_type', width: 10},
      {header: '注册时间', key: 'createdAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
    ]
  },
  withdrawList: {
    filename: '提现列表.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '申请时间', key: 'request_time', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '用户账号', key: 'username', width: 15},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '易宝流水号', key: 'yborderid', width: 40},
      {header: '提现金额', key: 'cash', width: 10},
      {header: '手续费', key: 'service_fee', width: 10},
      {header: '实际到账金额', key: 'fact_cash', width: 15},
      {header: '支付方式', key: 'pay_type', width: 10},
      {header: '银行账号', key: 'bank_account', width: 30},
      {header: '开户行', key: 'bank_deposit', width: 20},
      {header: '财务审核', key: 'state', width: 10},
      {header: '审核人', key: 'auditor_nickname', width: 10},
      {header: 'CEO审批', key: 'ceo_state', width: 10},
      {header: '认证类型', key: 'audit_type', width: 10},
      {header: '提现状态', key: 'withdraw_status', width: 10},
      {header: '最后处理时间', key: 'last_time', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}}
    ]
  },
  ceoAuditList: {
    filename: 'CEO审批列表.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '申请时间', key: 'request_time', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '用户账号', key: 'username', width: 15},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '易宝流水号', key: 'yborderid', width: 40},
      {header: '提现金额', key: 'cash', width: 10},
      {header: '手续费', key: 'service_fee', width: 10},
      {header: '实际到账金额', key: 'fact_cash', width: 15},
      {header: '支付方式', key: 'pay_type', width: 10},
      {header: '银行账号', key: 'bank_account', width: 30},
      {header: '开户行', key: 'bank_deposit', width: 20},
      {header: '财务审核', key: 'state', width: 10},
      {header: '审核人', key: 'auditor_nickname', width: 10},
      {header: 'CEO审批', key: 'ceo_state', width: 10},
      {header: '认证类型', key: 'audit_type', width: 10},
      {header: '提现状态', key: 'withdraw_status', width: 10},
      {header: '最后处理时间', key: 'last_time', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}}
    ]
  },
  chargeList: {
    filename: '充值列表.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '日期', key: 'create_time', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '用户账号', key: 'username', width: 15},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '流水号', key: 'yborderid', width: 40},
      {header: '充值请求号', key: 'requestno', width: 40},
      {header: '充值渠道', key: 'charge_type', width: 10},
      {header: '充值金额', key: 'amount', width: 10},
      {header: '状态', key: 'status', width: 5}
    ]
  },
  dealFlow: {
    filename: '交易流水.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '订单号', key: 'order_no', width: 25},
      {header: '用户账号', key: 'username', width: 15},
      {header: '用户姓名', key: 'nickname', width: 10},
      {header: '账单类型', key: 'bill_type', width: 15},
      {header: '支付方式', key: 'pay_type', width: 10},
      {header: '产品名称', key: 'p_product_name', width: 10},
      {header: '摘要', key: 'summary', width: 25},
      {header: '单价', key: 'price', width: 10},
      {header: '重量', key: 'weight', width: 10},
      {header: '金额', key: 'money', width: 10},
      {header: '日期', key: 'bill_date', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}}
    ]
  },
  shopList: {
    filename: '门店列表（金店或金行）.xlsx',
    columns: [
      // {header: 'Id', key: 'id', width: 10},
      {header: '商家账号', key: 'username', width: 15},
      {header: '企业名称', key: 'name', width: 25},
      {header: '联系人', key: 'contact_name', width: 15},
      {header: '联系电话', key: 'phone', width: 15},
      {header: '企业地址', key: 'complete_address', width: 25},
      {header: '支持提金', key: 'support_withdrawal', width: 10},
      {header: '参与推广', key: 'ext_activites', width: 10},
      {header: '参与排队', key: 'kpay_queue', width: 10},
      {header: '审核状态', key: 'state', width: 10},
      {header: '审核人', key: 'auditor', width: 10},
      {header: '提交时间', key: 'createdAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}},
      {header: '处理时间', key: 'updatedAt', width: 20, style: {numFmt: 'yyyy/dd/mm hh:mm:ss'}}
    ]
  },
};