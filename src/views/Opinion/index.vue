<template>
    <div class="box">
        <div class="opinion">
            <p class="title">意见反馈</p>
            <div class="head-box">
                <div class="head-top"><p>意见反馈</p></div>
                <div class="head">
                    <input class="ipt" type="text" v-model="nameValue" placeholder="请输入用户名称">
                    <input class="ipt" type="text" v-model="keyWord" placeholder="问题描述关键字">
                    <el-select v-model="valueStatus" clearable placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <button class="btn" @click="doFilter">确定</button>
                </div>
                <div class="main">
                    <el-table
                        :data="tableDataEnd.slice((currentPage-1)*pagesize, currentPage*pagesize)"
                        stripe
                        row-key="id"
                        header-row-class-name="rowHead"
                        @row-click="rowClick"
                        style="width: 100%">
                        <el-table-column
                            prop="userId"
                            label="ID"
                            align='center'
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="userName"
                            label="反馈用户"
                            align='center'>
                        </el-table-column>
                        <el-table-column
                            prop="userAdvice"
                            label="最新反馈内容"
                            show-overflow-tooltip
                            class-name='bg'
                            width="300"
                            align='center'>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态"
                            align='center'>
                            <template scope="scope">
                                <span v-if="scope.row.status === 0" style="color: #d72a2a;">未处理</span>
                                <span v-else-if="scope.row.status === 1" style="color: #d8ad2a;">处理中</span>
                                <span v-else-if="scope.row.status === 2" style="color: #34aa32;">已处理</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            :cell-style="cellStyle"
                            prop="status"
                            label="状态"
                            align='center'>
                        </el-table-column> -->
                        <el-table-column
                            prop="adviceTime"
                            label="最新处理时间"
                            align='center'>
                        </el-table-column>
                        <el-table-column
                            prop="managerName"
                            label="操作人"
                            align='center'>
                        </el-table-column>
                    </el-table>
                    <div class="foo">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[1, 10, 20]"
                            :page-size='pagesize'
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalItems">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="flag == true" class="tooltip">
            <div class="layer">
                <div class="layer-tip">
                    <p>反馈内容详情</p>
                    <b @click="hideBox">&times;</b>
                </div>
                <div class="layer-cent">
                    <ul class="uls">
                        <li>
                            <p>用户</p>
                            <p>用户账号</p>
                            <p>管理目标</p>
                            <p>所属医院</p>
                            <p>管理医生</p>
                            <p>管理时间</p>
                            <p>处理结果</p>
                        </li>
                        <li>
                            <p>{{userName}}</p>
                            <p>{{mbrId}}</p>
                            <p>{{managerTarget}}</p>
                            <p>{{orgName}}</p>
                            <p>{{drName}}</p>
                            <p>{{adviceTime}}</p>
                            <p>
                                <el-select @change="changeValue" v-model="detailsStatus" clearable placeholder="请选择">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </p>
                        </li>
                    </ul>
                    <div class="dialog-box">
                        <div class="dialog-top">
                            <div class="dialog-main" ref="dialogMain">
                                <div :class="item.name" v-for="(item, index) in dialogData" :key="index">
                                    <dl>
                                        <dt><img :src="item.imgUrl" alt=""></dt>
                                        <dd>
                                            <p>{{item.userAdvice}}</p>
                                            <p>{{item.adviceTime}}</p>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div class="dialog-foo">
                            <div class="input-box">
                                <input v-model="dialogValue" type="text" placeholder="请输入文字">
                            </div>
                            <button class="send" @click="sendClick">发送</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jQuery'
    import localhost from '../../util/localhost'
    export default{
        name: 'opinion',
        data () {
            return {
                flag: false,
                nameValue: '', // 用户名
                keyWord: '', // 关键字
                valueStatus: '', // 状态
                detailsStatus: '', // 详情状态
                totalItems: 0, // 总共条数
                pagesize: 0,
                options: [
                    {
                        value: '0',
                        label: '未处理'
                    }, 
                    {
                        value: '1',
                        label: '处理中'
                    }, 
                    {
                        value: '2',
                        label: '已处理'
                    }
                ],
                tableData: [],
                tableDataEnd: [],
                filterTableDataEnd:[],
                currentPage: 1,
                dialogValue: '', // 输入内容
                userName: '', // 详情用户
                mbrId: '', // 详情用户账号
                adminId: '',
                managerTarget: '', // 管理目标
                orgName: '', // 所属医院
                drName: '', // 管理医生
                adviceTime: '', // 管理时间
                dialogData: []
            }
        },
        created () {
            // this.totalItems = this.tableDataEnd.length
            // this.tableDataEnd = this.tableData
        },
        mounted () {
           this.defaultAjax()
        },
        methods: {
            sendClick () { // 发送
                console.log(this.adminId)
                let newDate = new Date()
                let Month = newDate.getMonth() + 1
                let Data = newDate.getDate()
                let Hours = newDate.getHours()
                let Minutes = newDate.getMinutes()
                if (Month < 10) {
                    Month =  '0' + Month
                } else if(Data < 10) {
                    Data =  '0' + Data
                } else if (Hours < 10) {
                    Hours = '0' + Hours
                } else if (Minutes < 10) {
                    Minutes = '0' + Minutes
                }
                let startDate = newDate.getFullYear() + '-' + Month + '-' + Data + ' ' + Hours + ':' + Minutes
                let obj = {
                    mbrId: this.mbrId,
                    content: this.dialogValue,
                    adminId: this.adminId,
                    status: this.detailsStatus
                    // name: 'right',
                    // cFrom: 1,
                    // imgUrl: 'http://p8lzo644o.bkt.clouddn.com/dialog.png',
                    // userAdvice: this.dialogValue,
                    // adviceTime: startDate
                }
                $.ajax({
                    type: 'put',
                    url: localhost + 'backstage/feedback/reply',
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    data: JSON.stringify(obj),
                    xhrFields:{withCredentials:true},
                    success: (data) => {
                        console.log(data)
                        if (data.code == '202') {
                            this.$message(data.msg);
                        } else {

                        }
                    }
                })
                // this.dialogData.push(obj)
                this.dialogValue = ''
            },
            changeValue () {
                console.log(this.detailsStatus)
                let obj = {
                    mbrId: this.mbrId,
                    status: this.detailsStatus
                }
                $.ajax({
                    type: 'patch',
                    url: localhost + 'backstage/feedback/handle',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    data: JSON.stringify(obj),
                    xhrFields:{withCredentials:true},
                    success: (data) => {
                        console.log(data)
                        if(data.code == '200') {
                            this.$message.success(data.msg);
                        } else {
                            this.$message.error(data.msg)
                        }
                    }
                })
            },
            rowClick (row, event, column) { // 点击出现详情
                this.flag = true
                $.ajax({
                    type: 'get',
                    url: localhost + 'backstage/feedback/detail',
                    xhrFields:{withCredentials:true},
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    data: {
                        mbrId: row.userId
                    },
                    success: (data) => {
                        console.log(data)
                        if (data.code == '200') {
                            this.adminId = row.adminId
                            let historyRecords = data.data.historyRecords
                            historyRecords.forEach((item) => {
                                if (item.cFrom == '0') {
                                    let obj = new Object(item)
                                    obj.name = 'left'
                                    obj.imgUrl = 'http://p8lzo644o.bkt.clouddn.com/logo.png'
                                } else if(item.cFrom == '1') {
                                    let obj = new Object(item)
                                    obj.name = 'right'
                                    obj.imgUrl = 'http://p8lzo644o.bkt.clouddn.com/dialog.png'
                                }
                            })
                            this.dialogData = historyRecords
                            let managerTarget = data.data.mbrInfo.managerTarget
                            let status = data.data.mbrInfo.status
                            this.userName = data.data.mbrInfo.userName  // 详情用户
                            this.mbrId = row.userId  // 详情用户账号
                            if (managerTarget == '01') {
                                this.managerTarget = '健康促进'
                            } else if (managerTarget == '02') {
                                this.managerTarget = '代谢综合征'
                            } else if (managerTarget == '03') {
                                this.managerTarget = '高血压'
                            } else if (managerTarget == '04') {
                                this.managerTarget = '糖尿病'
                            } else if (managerTarget == '05') {
                                this.managerTarget = '肥胖'
                            } else if (managerTarget == '06') {
                                this.managerTarget = '血脂异常'
                            } else if (managerTarget == '07') {
                                this.managerTarget = '慢阻肺'
                            }
                            if(status == '0') {
                                this.detailsStatus = '未处理'
                            } else if (status == '1') {
                                this.detailsStatus = '处理中'
                            } else if (status == '2') {
                                this.detailsStatus = '已处理'
                            }
                            this.orgName = data.data.mbrInfo.orgName  // 所属医院
                            this.drName = data.data.mbrInfo.drName // 管理医生
                            this.adviceTime = data.data.mbrInfo.adviceTime  // 管理时间

                        }
                    }
                })
            },
            hideBox(){ // 关闭详情页
                this.flag = false
            },
            doFilter () { // 查询
                console.log(this.valueStatus)
                if (this.nameValue === '' && this.keyWord === '' && this.valueStatus === '') {
                    this.$message.warning("查询条件不能为空！");
                    return;
                }
                this.defaultAjax()
                //每次手动将数据置空,因为会出现多次点击搜索情况
                // this.tableDataEnd = []
                // this.filterTableDataEnd = []
                // this.tableData.forEach((value, index) => {
                //     if(value.userId.indexOf(this.nameValue) === -1 && value.userAdvice.indexOf(this.keyWord) === -1 && value.status !== this.valueStatus) {
                //         return
                //     } else {
                //         this.filterTableDataEnd.push(value)
                //     }
                // })
                // this.tableDataEnd = this.filterTableDataEnd
                // this.totalItems = this.tableDataEnd.length
            },
            defaultAjax(){
                $.ajax({
                    type: 'get',
                    url: localhost + 'backstage/feedback',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Login_Authorization': localStorage.getItem('token'),
                        'User_Id': localStorage.getItem('id')
                    },
                    data: {
                        userInfo: this.nameValue,
                        keywords: this.keyWord,
                        status: this.valueStatus
                    },
                    xhrFields:{withCredentials:true},
                    success: (data) => {
                        console.log(data)
                        if (data.code == '200') {
                            data.data.datas.forEach((item) => {
                                let obj = new Object(item)
                                if(item.status == '0') {
                                    // item.status = '未处理'
                                    obj.adviceTime = ''
                                } else if (item.status == '1') {
                                    // item.status = '处理中'
                                    obj.adviceTime = item.startTime
                                } else if (item.status == '2') {
                                    // item.status = '已处理'
                                    obj.adviceTime = item.endTime
                                }
                            })
                            this.tableData = data.data.datas
                            this.tableDataEnd = data.data.datas
                            this.totalItems = data.data.total
                            this.pagesize = data.data.pageSize
                        }
                    }
                })
            },
            handleSizeChange(val) {
                this.pagesize = val
            },
            handleCurrentChange(val) {
                this.currentPage = val
            }
        }
    }
</script>
<style lang="less" scoped>
    .box{
        width: 100%;
        height: 100%;
        position: relative;
    }
    .opinion{
        width: 95%;
        height: 100%;
        margin: 0px auto;
        .title{
            padding-top: 30px;
            margin-bottom: 20px;
            font-size: 14px;
            color: rgb(102, 102, 102)
        }
        .head-box{
            background-color: #ffffff;
            border-radius: 10px;
            display: -webkit-flex;
            flex-direction: column;
            .head-top{
                display: -webkit-flex;
                align-items: center;
                border-bottom: 1px solid #eeeeee;
                p{
                    margin-top: 10px;
                    margin-bottom: 10px;
                    width: 100%;
                    height: 25px;
                    line-height: 25px;
                    font-style: 17px;
                    color: rgb(51, 51, 51);
                    border-left: 3px solid #02B3ED;
                    margin-left: 20px;
                    padding-left: 10px;
                }
            }
            .head{
                margin-top: 20px;
                margin-left: 10px;
                .ipt{
                    width: 140px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid #cccccc;
                    font-size: 14px;
                    color: #dddddd;
                    text-align: center;
                    margin-left: 20px;
                    outline: none;
                }
                .el-select{
                    width: 100px;
                    margin-left: 20px;
                }
                .btn{
                    margin-left: 20px;
                    width: 120px;
                    height: 40px;
                    border-radius: 10px;
                    border: none;
                    outline: none;
                    background: #02B3ED;
                    color: #ffffff;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
            .main{
                padding: 30px;
                padding-bottom: 0;
                .el-table{
                    color: #666666;
                    .el-table__header{
                        .rowHead{
                            background-color: #f00!important;
                        }
                    }
                    .bg .cell{
                        width: 300px;    
                        overflow: hidden;    
                        text-overflow:ellipsis;    
                        white-space: nowrap;
                    }
                }
                .foo{
                    height: 60px;
                    display: -webkit-flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
    .tooltip{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .3);
        z-index: 999;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        .layer{
            width: 95%;
            height: 85%;
            background: #ffffff;
            border-radius: 10px;
            .layer-tip{
                height: 60px;
                border-bottom: 1px solid #eeeeee;
                display: -webkit-flex;
                align-items: center;
                justify-content: space-between;
                p{
                    font-size: 17px;
                    color: #333333;
                    margin-left: 30px;
                }
                b{
                    font-size: 28px;
                    margin-right: 30px;
                    cursor: pointer;
                }
            }
            .layer-cent{
                width: 95%;
                height: 80%;
                margin: 0 auto;
                margin-top: 20px;
                .uls{
                    width: 100%;
                    display: -webkit-flex;
                    flex-direction: column;
                    border: 1px solid #dddddd;
                    li{
                        display: -webkit-flex;
                        width: 100%;
                        height: 60px;
                        &:nth-child(1){
                            background: #EEEEEE;
                        }
                        p{
                            flex:1;
                            height: 60px;
                            display: -webkit-flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 16px;
                            color: #666666;
                            &:nth-child(4), &:nth-child(2){
                                flex: 1.5
                            }
                            &:last-child{
                                color:#02B3ED;
                                .el-select{
                                    width: 100px;
                                    .el-input__inner{
                                        color: #02B3ED!important;
                                    }
                                    .el-option{
                                        color: #02B3ED;
                                    }
                                }
                            }
                        }
                    }
                }
                .dialog-box{
                    width: 100%;
                    height: 450px;
                    margin-top: 30px;
                    border: 1px solid #dddddd;
                    border-radius: 10px;
                    .dialog-top{
                        width: 100%;
                        height: 300px;
                        overflow-y: scroll;
                        .dialog-main{
                            width: 95%;
                            margin: 0 auto;
                            dl{
                                display: -webkit-flex;
                                dt{
                                    width: 100px;
                                    height: 90px;
                                    display: -webkit-flex;
                                    justify-content: center;
                                    align-items: center;
                                    img{
                                        width: 60px;
                                        height: 60px;
                                    }
                                }
                                dd{
                                    display: -webkit-flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    p{
                                        font-size: 16px;
                                        color: #666666;
                                        height: 25px;
                                        line-height: 25px;
                                    }
                                }
                            }
                            .left{
                                width: 100%;
                                height: 90%;
                                display: -webkit-flex;
                                align-items: center;
                                justify-content: flex-start;
                            }
                            .right{
                                width: 100%;
                                height: 90px;
                                display: -webkit-flex;
                                align-items: center;
                                justify-content: flex-end;
                                dl{
                                    width: 100%;
                                    height: 100%;
                                    position: relative;
                                    dt{
                                        position: absolute;
                                        right: 0;
                                        top: 0;
                                        width: 100px;
                                        height: 90px;
                                        display: -webkit-flex;
                                        justify-content: center;
                                        align-items: center;
                                    }
                                    dd{
                                        position: absolute;
                                        right: 100px;
                                        top: 0;
                                        display: -webkit-flex;
                                        flex-direction: column;
                                        height: 100%;
                                        p{
                                            display: -webkit-flex;
                                            align-items: center;
                                            justify-content: flex-end;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .dialog-foo{
                        width: 100%;
                        display: -webkit-flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .input-box{
                            width: 100%;
                            margin-top: 10px;
                            input{
                                width: 80%;
                                height: 70px;
                                border: 1px solid #dddddd;
                                margin-left: 10%;
                                font-size: 16px;
                                color: #aaaaaa;
                                padding-left: 20px;
                                outline: none;
                            }
                        }
                        .send{
                            width: 176px;
                            height: 40px;
                            border: none;
                            color: #fff;
                            background: #02B3ED;
                            outline: none;
                            cursor: pointer;
                            border-radius: 10px;
                            font-size: 18px;
                            margin-top: 20px;
                        }
                    }
                }
            }
        }
    }
</style>
