<template>
  <div class="data-render">
    <!--头部-->
    <section class="render-title-wrapper">
      <mu-appbar style="width: 100%;" color="primary">
        <span>闲鱼数据</span>
        <mu-button flat slot="right" @click="sortDown">
          <i class="el-icon-sort-down"></i>
        </mu-button>
        <mu-button flat slot="right" @click="sortUp">
          <i class="el-icon-sort-up"></i>
        </mu-button>
        <mu-button flat slot="right" @click="dialogFormVisible = true">
          <mu-icon value="search"></mu-icon>
        </mu-button>
        <mu-button flat slot="right" @click="refreshData()">
          <mu-icon value="refresh"></mu-icon>
        </mu-button>
        <el-dialog title="请输入要查询的内容" :visible.sync="dialogFormVisible"
                   :close-on-click-modal='false' append-to-body @close="closeSearch">
          <el-form :model="searchForm">
            <el-form-item label="请选择关键词：">
              <mu-select v-model="searchForm.keywordName" full-width>
                <mu-option v-for="item in keywordList" :key="item.search_id" :label="item.keyword" :value="item.keyword"></mu-option>
              </mu-select>
            </el-form-item>
            <el-form-item label="请选择检测时间：">
              <div class="check-start-time">
                <mu-date-input  icon="today" v-model="searchForm.checkTime.startTime" label="开始时间"
                                type="dateTime" view-type="list" actions label-float full-width landscape></mu-date-input>
              </div>
              <div class="check-end-time">
                <mu-date-input  icon="today" v-model="searchForm.checkTime.endTime" label="结束时间"
                                type="dateTime" view-type="list" actions label-float full-width landscape></mu-date-input>
              </div>
          </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="searchInfos">确 定</el-button>
          </div>
        </el-dialog>
      </mu-appbar>
    </section>
    <!--内容-->
    <section class="render-content-wrapper">
      <mu-container ref="container" class="demo-loadmore-content">
        <mu-load-more @refresh="refreshData" :refershing="refershing" :loading="tableLoading" @load="loadData">
          <mu-paper class="demo-paper" :z-depth="4" v-for="(item) in goodsTableList" :key="item.id">
            <div class="content-default" slot="default">
              <div class="content-info">
                <div class="con-default-img">
                  <el-image :src="item.picture" :key="item.user_id" fit="fill" lazy></el-image>
                </div>
                <div class="con-default-info">
                  <div class="dis-flex info-title">
                    <b>标题：</b>
                    <el-tooltip class="item" effect="dark" :content="item.goods_name" placement="top">
                      <span>{{item.goods_name}}</span>
                    </el-tooltip>
                  </div>
                  <div class="dis-flex info-seller">
                    <b>卖家：</b><span>{{item.user_name}}</span>
                  </div>
                  <div class="dis-flex info-price">
                    <b>价格：</b><span>{{item.price}}</span>
                  </div>
                  <div class="dis-flex info-linkPlace">
                    <b>链接：</b>
                    <el-tooltip class="item" effect="dark" :content="item.detail_url" placement="top">
                      <span>{{item.detail_url}}</span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </mu-paper>
        </mu-load-more>
      </mu-container>
    </section>
    <!--底部导航-->
    <section class="render-bottom-wrapper">
      <mu-container>
        <mu-bottom-nav @change="changeBottomNav">
          <mu-bottom-nav-item title="闲鱼数据" icon="books"></mu-bottom-nav-item>
          <mu-bottom-nav-item title="新增数据" icon="books"></mu-bottom-nav-item>
        </mu-bottom-nav>
      </mu-container>
    </section>
  </div>
</template>

<script>
// 接口文件
import { getAllDataleApi, getKeyWordApi } from '../service/thisApi'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'DataRender',
  data () {
    return {
      tableLoading: false,
      refershing: false,
      searchForm: {
        keywordName: '', // 关键词
        checkTime: {
          startTime: '', // 检测时间
          endTime: '' // 检测时间
        }
      },
      dialogFormVisible: false,
      keywordList: [],
      pageNo: 1, // 页数
      pageSize: 6, // 每页条数
      isDataNew: 0,
      goodsTableList: [] // 商品列表
    }
  },
  computed: {
    ...mapState('thisVuex', {
      storeValue: 'storeValue'
    })
  },
  methods: {
    ...mapMutations('thisVuex', []),
    ...mapActions('thisVuex', []),
    // 获取列表
    async getTableList (val, more) {
      // 显示loading
      this.tableLoading = true
      let param = {}
      if (!val) {
        this.pageNo = 1
        param.page = this.pageNo // 页数
        param.per_page = this.pageSize // 个数
        param.sort_type = -1
        param.keyword = ''
        param.start_time = ''
        param.end_time = ''
        param.is_new = this.isDataNew
      } else {
        param = val
      }
      await getAllDataleApi(param).then((res) => {
        if (more) {
          // 接口获取成功
          this.goodsTableList = this.goodsTableList.concat(res.data.list)
        } else {
          this.goodsTableList = []
          this.goodsTableList = res.data.list
        }
        console.log('接口获取成功', res)
        // 取消 重新加载
        this.refershing = false
        // 取消loading
        this.tableLoading = false
        this.dialogFormVisible = false
      }, () => {
        this.goodsTableList = []
        // setTimeout(() => {
        //
        // }, 2000)
        // 接口获取失败
        this.goodsTableList = [
          {
            user_id: '597190927505',
            user_name: 'love⽑⽑精品屋',
            search_id: 'CD%BB%FA',
            keyword: 'CD机',
            picture: 'https://img.alicdn.com/bao/uploaded/i4/O1CN011Yl1nj1dLnsgcUfLx_!!0-fleamarket.jpg_728x728.jpg',
            price: 31000,
            goods_name: '丹⻨嘉图 gato audio cd机',
            detail_url: 'https://2.taobao.com/item.htm?id=597190927505',
            data_time: 1561427491
          },
          {
            user_id: '581455846054',
            user_name: 'yalewong30',
            search_id: 'CD%BB%FA',
            keyword: '功放',
            picture: 'https://img.alicdn.com/bao/uploaded/i2/TB2uz7Rm5rpK1RjSZFhXXXSdXXa_!!0-fleamarket.jpg_220x10000.jpg',
            price: 20000,
            goods_name: 'Altec钴磁古董分频⾳箱供欣赏',
            detail_url: 'https://2.taobao.com/item.htm?id=581455846054',
            data_time: 1561427490
          },
          {
            user_id: '585330152469',
            user_name: '程丽⻘1188',
            search_id: '%B9%A6%B7%C5',
            keyword: '功放',
            picture: 'https://img.alicdn.com/bao/uploaded/i2/O1CN01ncb1551fmU9zXTGXw_!!0-fleamarket.jpg_220x10000.jpg',
            price: 8200,
            goods_name: '美国原装jbl938舞台专业⾳箱',
            detail_url: 'https://2.taobao.com/item.htm?id=585330152469',
            data_time: 1561427490
          },
          {
            user_id: '584835441418',
            user_name: 'zhmai',
            search_id: '%B9%A6%B7%C5',
            keyword: '功放',
            picture: 'https://img.alicdn.com/bao/uploaded/i2/O1CN01ncb1551fmU9zXTGXw_!!0-fleamarket.jpg_220x10000.jpg',
            price: 8000,
            goods_name: 'JBL 4312xp 监听⾳箱',
            detail_url: 'https://2.taobao.com/item.htm?id=584835441418',
            data_time: 1561384554
          },
          {
            user_id: '582391423335',
            user_name: 't_1498657745454_0650',
            search_id: '%D2%F4%CF%EC',
            keyword: '音响',
            picture: 'https://img.alicdn.com/bao/uploaded/i1/O1CN01V4ymrg1H0Lk5XV7Hh_!!0-fleamarket.jpg_220x10000.jpg',
            price: 5888,
            goods_name: '建伍9300⾳响 建伍落地超级组合⾳响 建伍顶级⾳箱',
            detail_url: 'https://2.taobao.com/item.htm?id=582391423335',
            data_time: 1561427490
          },
          {
            user_id: '562528985491',
            user_name: 'kimwang97 ',
            detail_url: 'https://2.taobao.com/item.htm?id=562528985491',
            goods_name: '英国BBC御⽤前级板双声道',
            keyword: '功放',
            picture: 'https://img.alicdn.com/bao/uploaded/i2/6000000003024/TB2evEvhcrI8KJjy0FhXXbfnpXa_!!0-fleamarket.jpg_220x10000.jpg',
            price: 4860,
            search_id: '%B9%A6%B7%C5',
            date_time: 1561427490
          }
        ]
        // 取消 重新加载
        this.refershing = false
        this.tableLoading = false
        this.dialogFormVisible = false
        this.$message({
          message: '列表获取失败，请重新请求！',
          showClose: true,
          type: 'error'
        })
      })
    },
    // 获取关键词
    async getKeyWordList () {
      await getKeyWordApi().then((res) => {
        this.keywordList = res.data.status.list
        console.log('关键词列表', res)
      }, () => {
        this.keywordList = [
          {
            search_id: '%B9%A6%B7%C5',
            keyword: '功放'
          },
          {
            search_id: '%D2%F4%CF%EC',
            keyword: '音响'
          },
          {
            search_id: 'CD%BB%FA',
            keyword: 'CD机'
          }
        ]
        this.$message({
          message: '关键词列表获取失败，请重新请求！',
          showClose: true,
          type: 'error'
        })
      })
    },
    // 升序
    sortUp () {
      let param = {
        page: this.pageNo,
        per_page: this.pageSize,
        keyword: '',
        start_time: '',
        end_time: '',
        sort_type: 1,
        is_new: this.isDataNew
      }
      if (!this.tableLoading) {
        console.log('升序', param)
        this.getTableList(param)
      }
    },
    // 降序
    sortDown () {
      let param = {
        page: this.pageNo,
        per_page: this.pageSize,
        keyword: '',
        start_time: '',
        end_time: '',
        sort_type: -1,
        is_new: this.isDataNew
      }
      if (!this.tableLoading) {
        console.log('降序', param)
        this.getTableList(param)
      }
    },
    // 刷新列表
    refreshData () {
      console.log('刷新列表')
      this.refershing = true
      // 回到顶部
      this.$refs.container.scrollTop = 0
      if (!this.tableLoading) {
        this.getTableList()
      }
    },
    // 加载列表
    loadData () {
      console.log('加载更多')
      if (!this.tableLoading) {
        this.tableLoading = true
        this.pageNo += 1
        let param = {
          page: this.pageNo,
          per_page: this.pageSize,
          keyword: '',
          start_time: '',
          end_time: '',
          sort_type: -1,
          is_new: this.isDataNew
        }
        this.getTableList(param, true)
      }
    },
    // 关闭搜索弹框
    closeSearch () {
      console.log('关闭查询弹框')
      this.searchForm.keywordName = ''
      this.searchForm.checkTime.startTime = ''
      this.searchForm.checkTime.endTime = ''
    },
    // 搜索框
    searchInfos () {
      let param = {
        page: this.pageNo,
        per_page: this.pageSize,
        keyword: '',
        start_time: '',
        end_time: '',
        sort_type: -1,
        is_new: this.isDataNew
      }
      if (!this.searchForm.keywordName && !this.searchForm.checkTime.startTime && !this.searchForm.checkTime.endTime) {
        this.$message({
          message: '请至少输入一条信息进行查询！',
          showClose: true,
          type: 'warning'
        })
        return
      }
      if (this.searchForm.keywordName) {
        param.keyword = this.searchForm.keywordName
      }
      if (this.searchForm.checkTime) {
        param.start_time = this.searchForm.checkTime.startTime
        param.end_time = this.searchForm.checkTime.endTime
      }
      let newDate = Math.floor(new Date(this.searchForm.checkTime.startTime).getTime() / 1000)
      if (!this.tableLoading) {
        console.log('查询', param, newDate)
        this.getTableList(param)
      }
    },
    // 改变底部导航
    changeBottomNav (row) {
      this.isDataNew = row
      // 回到顶部
      this.$refs.container.scrollTop = 0
      this.pageNo = 1
      if (row === 1) {
        let param = {
          page: this.pageNo, // 页数
          per_page: this.pageSize, // 每页数量
          keyword: '',
          start_time: '',
          end_time: '',
          sort_type: -1,
          is_new: this.isDataNew
        }
        if (!this.tableLoading) {
          this.getTableList(param)
        }
      } else {
        let param = {
          page: this.pageNo, // 页数
          per_page: this.pageSize, // 每页数量
          keyword: '',
          start_time: '',
          end_time: '',
          sort_type: -1,
          is_new: this.isDataNew
        }
        if (!this.tableLoading) {
          this.getTableList(param)
        }
      }
    }
  },
  mounted () {
    // 获取列表
    this.getTableList()
    // 获取关键词列表
    this.getKeyWordList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  /deep/ .el-dialog {
    width: 96%;
    /deep/ .el-dialog__body {
      padding-top: 4px;
      padding-bottom: 4px;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
    }
  }
.data-render {
  .render-title-wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    .check-start-time {
      position: absolute;
      top: -1.6rem;
      left: 3.2rem;
    }
    .check-end-time {
      position: absolute;
      top: 2rem;
      left: 3.2rem;
    }
  }
  .render-content-wrapper {
    position: relative;
    top: 3rem;
    width: 100%;
    margin-top: .5rem;
    .demo-loadmore-content {
      max-height: 696px;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .content-default {
      margin: .5rem .5rem 1rem .5rem;
      padding: .2rem 0 .5rem 0;
      .content-info {
        display: flex;
        justify-content: space-around;
        max-height: 7rem;
        overflow: auto;
        .con-default-img{
          max-width: 5rem;
          max-height: 6rem;
          /deep/ .el-image {
            vertical-align: middle;
            width: 100%;
            height: 100%;
          }
        }
        .con-default-info {
          width: 74%;
          overflow-y: auto;
          b{
            text-align: right;
            width: 4rem;
            max-width: 4rem;
          }
          span {
            width: 100%;
            height: 1.3rem;
            max-height: 1.3rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .content-action {}
  }
  .render-bottom-wrapper{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  // 公用的类样式
  .dis-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
