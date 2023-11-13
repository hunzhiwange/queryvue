import router from '../router'
import utils from './index'

export function renderTableMultiLine(h, params, config = {}) {
  return (
    <div className="table-multi-line">
      <p>
        <Text
          transfer={true}
          theme="light"
          ellipsis={true}
          ellipsis-config={{ tooltip: true }}
          max-width={500}
        >
          {params.row[config.firstKey]}
        </Text>
      </p>
      <p>
        <Text type="secondary">{params.row[config.secondKey]}</Text>
      </p>
    </div>
  )
}

export function renderProductTitle(h, params, config = {}) {
  return (
    <div class="table-multi-line">
      <p>
        <Text
          transfer={true}
          theme="light"
          ellipsis={true}
          ellipsis-config={{ tooltip: true }}
          max-width={500}
        >
          <a
            onClick={() =>
              utils.toProductDetail(params.row[`${config.prefix}id`])
            }
          >
            {params.row[`${config.prefix}title`]}
          </a>
        </Text>
      </p>
      <p>
        <Tooltip
          placement="bottom-start"
          delay={1000}
          theme="light"
          transfer={true}
          v-slots={{
            content: () => (
              <>
                {__('规格编号')}{' '}
                <Text type="warning">
                  {params.row[`${config.prefix}sku_no`]}
                </Text>
              </>
            ),
          }}
        >
          <Text type="secondary">{params.row[`${config.prefix}spu_no`]}</Text>
        </Tooltip>
      </p>
    </div>
  )
}

export function renderProductSkuTitle(h, params, config = {}) {
  return (
    <div className="table-multi-line">
      {params.row[`${config.prefix}sku_title`] ? (
        <>
          <p>
            <Text
              transfer={true}
              theme="light"
              ellipsis={true}
              ellipsis-config={{ tooltip: true }}
              max-width={500}
            >
              {params.row[`${config.prefix}sku_title`]}
            </Text>
          </p>
        </>
      ) : (
        ''
      )}
      <p>
        <Tooltip
          placement="bottom-start"
          delay={1000}
          theme="light"
          transfer={true}
          v-slots={{
            content: () => (
              <>
                {__('产品编号')}{' '}
                <Text type="warning">
                  {params.row[`${config.prefix}spu_no`]}
                </Text>
              </>
            ),
          }}
        >
          <Text type="secondary">{params.row[`${config.prefix}sku_no`]}</Text>
        </Tooltip>
      </p>
    </div>
  )
}

export function renderImages(h, params, config = {}) {
  return (
    <Tooltip
      placement="right-start"
      theme="light"
      transfer={true}
      disabled={!params.row[config.key]}
      max-width={500}
      v-slots={{
        content: () => <Image src={params.row[config.key]} fit="contain" />,
      }}
    >
      <Image
        src={params.row[config.key]}
        fit="contain"
        width="40px"
        height="40px"
        v-slots={{
          error: () => <Icon type="md-images" size="40" color="#e5e6eb" />,
        }}
      />
    </Tooltip>
  )
}

export function renderSummary(columns, data) {
  const sums = {}
  columns.forEach((column) => {
    const key = column.key
    const isSummary =
      Object.prototype.hasOwnProperty.call(column, 'summary') && column.summary
    if (
      Object.prototype.hasOwnProperty.call(column, 'type') &&
      column.type == 'index'
    ) {
      sums[key] = {
        key,
        value: __('合计'),
      }
      return
    }

    if (!isSummary) {
      sums[key] = {
        key,
        value: '',
      }
      return
    }

    const values = data.map((item) => Number(item[key]))
    if (!values.every((value) => isNaN(value))) {
      const v = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)

      const summaryUnit =
        Object.prototype.hasOwnProperty.call(column, 'summary_unit') &&
        column.summary_unit

      sums[key] = {
        key,
        value: v + summaryUnit,
      }
    } else {
      sums[key] = {
        key,
        value: 0,
      }
    }
  })

  return sums
}

export function renderHeaderHelper(h, params, config = {}) {
  return (
    <Space>
      <strong>{params.column.title}</strong>
      <Tooltip
        theme="light"
        max-width="900"
        placement="top"
        transfer={true}
        v-slots={{
          content: config.content,
        }}
      >
        <Icon type="ios-help-circle-outline" />
      </Tooltip>
    </Space>
  )
}

export function renderChangeNumber(h, params, config = {}) {
  return (
    <Text type={params.row[config.key] > 0 ? 'success' : 'danger'} strong>
      {params.row[config.key] > 0
        ? '+' + params.row[config.key]
        : params.row[config.key]}
    </Text>
  )
}

export function renderDocDetail(h, params, config = {}) {
  let orderNo = params.row[config.key]

  return <a onClick={() => utils.toDocDetail(orderNo)}>{orderNo}</a>
}

function initRenderDocDetail(columns) {
  columns.forEach((column) => {
    if (true !== column.renderDocDetail) {
      return
    }

    column.render = (h, params) => {
      let config = {
        key: column.key,
      }
      return renderDocDetail(h, params, config)
    }
  })
}

function initRenderChangeNumber(columns) {
  columns.forEach((column) => {
    if (true !== column.renderChangeNumber) {
      return
    }

    column.render = (h, params) => {
      let config = {
        key: column.key,
      }

      return renderChangeNumber(h, params, config)
    }
  })
}

function initRenderHeaderHelper(columns) {
  columns.forEach((column) => {
    if (undefined === column.renderHeaderHelper) {
      return
    }

    column.renderHeader = (h, params) => {
      let config = {
        content: column.renderHeaderHelper,
      }

      return renderHeaderHelper(h, params, config)
    }
  })
}

function initRenderImages(columns) {
  columns.forEach((column) => {
    if (true !== column.renderImages) {
      return
    }

    let renderImagesKey = column.renderImagesKey
      ? column.renderImagesKey
      : column.key

    column.width = 45
    column.className = 'table-images'
    column.align = 'center'
    column.render = (h, params) => {
      let config = {
        key: renderImagesKey,
      }

      return renderImages(h, params, config)
    }
  })
}

function initRenderEllipsis(columns) {
  let initData = {
    ellipsis: true,
    tooltip: true,
    tooltipTheme: 'light',
    tooltipMaxWidth: 400,
  }
  let keys = Object.keys(initData)

  columns.forEach((column) => {
    if (true !== column.renderEllipsis) {
      return
    }

    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(column, key)) {
        return
      }
      column[key] = initData[key]
    })
  })
}

function initRenderProductTitle(columns) {
  columns.forEach((column) => {
    if (true !== column.renderProductTitle) {
      return
    }

    let prefix = Object.prototype.hasOwnProperty.call(
      column,
      'renderProductTitlePrefix',
    )
      ? column.renderProductTitlePrefix
      : 'product.'
    column.db_column = `${prefix}id,${prefix}sku_no,${prefix}title,${prefix}spu_no`
    column.render = (h, params) => {
      let config = {
        prefix,
      }
      return renderProductTitle(h, params, config)
    }
  })
}

function initRenderProductSkuTitle(columns) {
  columns.forEach((column) => {
    if (true !== column.renderProductSkuTitle) {
      return
    }

    let prefix = Object.prototype.hasOwnProperty.call(
      column,
      'renderProductSkuTitlePrefix',
    )
      ? column.renderProductSkuTitlePrefix
      : 'product.'
    column.db_column = `${prefix}sku_title,${prefix}sku_no,${prefix}spu_no`
    column.render = (h, params) => {
      let config = {
        prefix,
      }
      return renderProductSkuTitle(h, params, config)
    }
  })
}

function initRenderTableMultiLine(columns) {
  columns.forEach((column) => {
    if (true !== column.renderTableMultiLine) {
      return
    }

    column.render = (h, params) => {
      let dbColumn = column.db_column.split(',')
      let config = {
        firstKey: column.renderTableMultiLineFirstKey
          ? column.renderTableMultiLineFirstKey
          : dbColumn[0],
        secondKey: column.renderTableMultiLineSecondKey
          ? column.renderTableMultiLineSecondKey
          : dbColumn[1],
      }
      return renderTableMultiLine(h, params, config)
    }
  })
}

export function renderCommon(columns) {
  // 图像渲染
  initRenderImages(columns)

  // 省略号
  initRenderEllipsis(columns)

  // 产品标题
  initRenderProductTitle(columns)
  initRenderProductSkuTitle(columns)

  // 多行
  initRenderTableMultiLine(columns)

  // 头部帮助
  initRenderHeaderHelper(columns)

  // 变更数量
  initRenderChangeNumber(columns)

  // 单据详情
  initRenderDocDetail(columns)
}
